/**
 * Dagger geometry traced from the studio logo (screenshot source, awaiting vector).
 * Local coordinates: tip at (0,0), pointing down, pommel at y = -156.
 */
export const daggerParts = {
  blade: 'M0 0 9 -103 10.5 -108 -10.5 -108 -9 -103Z',
  grip: 'M0 -112C8.5 -119 8.5 -143 0 -149C-8.5 -143 -8.5 -119 0 -112Z',
  guard: 'M-26 -110Q0 -119 26 -110',
  quillons: [
    [-28.5, -107.5, 5.2],
    [28.5, -107.5, 5.2],
  ] as const,
  pommel: [0, -152, 4.4] as const,
};

/** The three daggers of the studio mark, fanned about the shared tip. */
export const fan = [
  { rotate: -27.5, scale: 0.885 },
  { rotate: 27.5, scale: 0.885 },
  { rotate: 0, scale: 1 },
] as const;
