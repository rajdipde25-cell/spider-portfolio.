export const vertexShader = `
varying vec2 vUv;
uniform float uHovered;
uniform float uScale;

void main() {
  vUv = uv;
  
  // Very subtle zoom in effect on hover
  vec3 pos = position;
  float scale = 1.0 + (uHovered * uScale * 0.5);
  // Scale from the center
  pos *= scale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec2 uMouse;
uniform float uHovered;
uniform float uRadius;
uniform float uSoftness;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Correct the UVs to maintain aspect ratio
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );
  
  vec2 centeredUv = vUv - vec2(0.5);
  vec2 uvCover = centeredUv * ratio + vec2(0.5);

  // Dynamic noise for the mask edge
  float n = snoise(uvCover * 3.0 + uMouse * 2.0) * 0.15;
  float n2 = snoise(uvCover * 6.0 - uMouse * 1.0) * 0.05;
  
  // Calculate mask with noise distortion
  vec2 screenRatio = vec2(uResolution.x / uResolution.y, 1.0);
  if (uResolution.y > uResolution.x) {
    screenRatio = vec2(1.0, uResolution.y / uResolution.x);
  }
  
  vec2 uvMouse = vUv * screenRatio;
  vec2 cursor = uMouse * screenRatio;

  float dist = distance(uvMouse, cursor);
  
  // Transition logic
  float currentRadius = uRadius * uHovered;
  
  // The 'Tear' effect: dist + noise vs radius
  float maskThreshold = currentRadius + n + n2;
  float mask = 1.0 - smoothstep(maskThreshold - uSoftness, maskThreshold + uSoftness, dist);
  mask *= uHovered;

  // Chromatic Aberration logic
  float aberrationOffset = mask * (1.0 - mask) * 0.03 * uHovered;
  
  vec4 r = texture2D(uTexture2, uvCover + vec2(aberrationOffset, 0.0));
  vec4 g = texture2D(uTexture2, uvCover);
  vec4 b = texture2D(uTexture2, uvCover - vec2(aberrationOffset, 0.0));
  
  vec4 color2 = vec4(r.r, g.g, b.b, 1.0);
  
  // Base color
  vec4 color1 = texture2D(uTexture1, uvCover);

  // Add subtle distortion to background image too
  if (uHovered > 0.01) {
    vec2 distortedUv1 = uvCover + (mask * 0.02);
    color1 = texture2D(uTexture1, distortedUv1);
  }

  // Mix between color1 and color2 based on the noisy mask
  vec4 finalColor = mix(color1, color2, mask);

  // Add web-like glow lines at the edge of the mask
  float edge = smoothstep(0.4, 0.5, mask) * (1.0 - smoothstep(0.5, 0.6, mask));
  finalColor.rgb += vec3(0.8, 0.1, 0.1) * edge * 0.3 * uHovered;

  gl_FragColor = finalColor;
}
`;
