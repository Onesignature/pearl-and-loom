"use client";

// Bedouin pearl-merchant's chest, in 3D.
//
// Sandalwood body with vertical brass strapping bands, brass corner
// brackets with rivets, a brass keyhole plate, an open lid (hinged at
// the back) with three mother-of-pearl Sadu diamond inlays, and an
// indigo velvet-lined interior with a 4×3 pearl compartment grid.
//
// The pearls inside are the player's actual collected pearls — coloured
// by tier from `lib/pearl/colors.ts` so common/fine/royal read at a
// glance under bloom + ACESFilmic tone mapping.
//
// Scope budget: one Canvas, ~400 LoC, drei primitives only, route-scoped
// lazy load, frameloop="demand" so it sleeps offscreen, full reduced-
// motion support. Bound to gameplay (it IS the chest), not a decoration
// room.

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

import type { PearlGrade } from "@/lib/store/progress";
import { PEARL_TIERS } from "@/lib/pearl/colors";

interface PearlChest3DProps {
  pearls: { id: string; grade: PearlGrade }[];
  reducedMotion?: boolean;
  /** Side length in CSS pixels; the Canvas fills its parent otherwise. */
  height?: number;
}

// --- Chest geometry constants. Tuned so the open lid is fully visible
//     from a 3/4 camera and the 4×3 pearl grid sits cleanly on the floor.
const CHEST_W = 4.2; // outer width (X)
const CHEST_D = 2.6; // outer depth (Z)
const CHEST_H = 1.6; // outer body height (Y)
const WALL = 0.18; // wall thickness
const LID_THICKNESS = 0.18;
// Lid opens to ~100° from horizontal — well past vertical so the inlay
// faces the camera and doesn't block the view down into the interior.
const LID_OPEN_DEG = 100;

const COLUMNS = 4;
const ROWS = 3;
const SLOT_X = 0.74;
const SLOT_Z = 0.56;
const FLOOR_Y = WALL; // top of the chest's bottom wall

// --- Materials (factored so we can re-use them across meshes without
//     allocating a fresh material object on every render).
const SANDALWOOD = "#7C4321";
const SANDALWOOD_DEEP = "#4D2812";
const SANDALWOOD_TOP = "#A8633A";
const BRASS = "#A07832";
const BRASS_BRIGHT = "#E8C36A";
const VELVET = "#1B2554";
const VELVET_FLOOR = "#0A1030";
const MOP = "#F0EAFA";

interface SlotPlacement {
  position: [number, number, number];
  pearl: { id: string; grade: PearlGrade } | null;
  index: number;
}

function makeSlots(
  pearls: { id: string; grade: PearlGrade }[],
): SlotPlacement[] {
  const slots: SlotPlacement[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const i = row * COLUMNS + col;
      const x = (col - (COLUMNS - 1) / 2) * SLOT_X;
      const z = (row - (ROWS - 1) / 2) * SLOT_Z;
      slots.push({
        position: [x, FLOOR_Y + 0.18, z],
        pearl: pearls[i] ?? null,
        index: i,
      });
    }
  }
  return slots;
}

// --------------------------------------------------------------------
// Pearl
// --------------------------------------------------------------------

function Pearl({
  grade,
  position,
  reducedMotion,
  index,
}: {
  grade: PearlGrade;
  position: [number, number, number];
  reducedMotion: boolean;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const tier = PEARL_TIERS[grade];
  const phase = useMemo(() => index * 0.7, [index]);

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    const t = clock.elapsedTime + phase;
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.06;
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.42}
      position={position}
    >
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[0.18, 48, 48]} />
        <meshPhysicalMaterial
          color={tier.mid}
          metalness={0.05}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.06}
          sheen={1}
          sheenColor={tier.core}
          sheenRoughness={0.4}
          envMapIntensity={1.6}
        />
      </mesh>
      {grade === "royal" && (
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshBasicMaterial
            color="#F4C85A"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </Float>
  );
}

// --------------------------------------------------------------------
// Chest pieces
// --------------------------------------------------------------------

/** Velvet floor with a 4×3 stitched compartment grid showing through. */
function VelvetFloor() {
  return (
    <group>
      <mesh
        position={[0, FLOOR_Y + 0.001, 0]}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry
          args={[CHEST_W - 2 * WALL, CHEST_D - 2 * WALL]}
        />
        <meshStandardMaterial
          color={VELVET_FLOOR}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {/* Compartment seams — thin raised lines, like quilting threads */}
      {[1, 2, 3].map((i) => {
        const x = -((CHEST_W - 2 * WALL) / 2) + (i * (CHEST_W - 2 * WALL)) / COLUMNS;
        return (
          <mesh
            key={`seam-x-${i}`}
            position={[x, FLOOR_Y + 0.012, 0]}
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[0.012, CHEST_D - 2 * WALL]} />
            <meshStandardMaterial
              color="#3A4480"
              roughness={1}
              metalness={0}
            />
          </mesh>
        );
      })}
      {[1, 2].map((i) => {
        const z = -((CHEST_D - 2 * WALL) / 2) + (i * (CHEST_D - 2 * WALL)) / ROWS;
        return (
          <mesh
            key={`seam-z-${i}`}
            position={[0, FLOOR_Y + 0.012, z]}
            rotation-x={-Math.PI / 2}
          >
            <planeGeometry args={[CHEST_W - 2 * WALL, 0.012]} />
            <meshStandardMaterial
              color="#3A4480"
              roughness={1}
              metalness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** The wooden chest body — bottom + four walls, with sandalwood material. */
function ChestBody() {
  const innerW = CHEST_W - 2 * WALL;
  const innerD = CHEST_D - 2 * WALL;
  return (
    <group>
      {/* Bottom slab */}
      <RoundedBox
        args={[CHEST_W, WALL, CHEST_D]}
        radius={0.025}
        smoothness={4}
        position={[0, WALL / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={SANDALWOOD_DEEP} roughness={0.85} metalness={0.04} />
      </RoundedBox>
      {/* Front wall (camera side) */}
      <RoundedBox
        args={[CHEST_W, CHEST_H, WALL]}
        radius={0.025}
        smoothness={4}
        position={[0, WALL + CHEST_H / 2, CHEST_D / 2 - WALL / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={SANDALWOOD} roughness={0.82} metalness={0.05} />
      </RoundedBox>
      {/* Back wall */}
      <RoundedBox
        args={[CHEST_W, CHEST_H, WALL]}
        radius={0.025}
        smoothness={4}
        position={[0, WALL + CHEST_H / 2, -CHEST_D / 2 + WALL / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={SANDALWOOD_DEEP} roughness={0.85} metalness={0.05} />
      </RoundedBox>
      {/* Left wall */}
      <RoundedBox
        args={[WALL, CHEST_H, CHEST_D - 2 * WALL]}
        radius={0.02}
        smoothness={4}
        position={[-CHEST_W / 2 + WALL / 2, WALL + CHEST_H / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={SANDALWOOD_DEEP} roughness={0.85} metalness={0.05} />
      </RoundedBox>
      {/* Right wall */}
      <RoundedBox
        args={[WALL, CHEST_H, CHEST_D - 2 * WALL]}
        radius={0.02}
        smoothness={4}
        position={[CHEST_W / 2 - WALL / 2, WALL + CHEST_H / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={SANDALWOOD_DEEP} roughness={0.85} metalness={0.05} />
      </RoundedBox>
      {/* Indigo velvet inner walls — slightly inset from the wood walls */}
      {[
        // [position, size]
        { pos: [0, WALL + 0.6, CHEST_D / 2 - WALL - 0.005] as [number, number, number], size: [innerW, 1.2, 0.01] as [number, number, number] },
        { pos: [0, WALL + 0.6, -CHEST_D / 2 + WALL + 0.005] as [number, number, number], size: [innerW, 1.2, 0.01] as [number, number, number] },
        { pos: [-CHEST_W / 2 + WALL + 0.005, WALL + 0.6, 0] as [number, number, number], size: [0.01, 1.2, innerD] as [number, number, number] },
        { pos: [CHEST_W / 2 - WALL - 0.005, WALL + 0.6, 0] as [number, number, number], size: [0.01, 1.2, innerD] as [number, number, number] },
      ].map((w, i) => (
        <mesh key={`velvet-${i}`} position={w.pos}>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color={VELVET} roughness={0.95} metalness={0} />
        </mesh>
      ))}
      <VelvetFloor />
    </group>
  );
}

/** Vertical brass strapping bands on the front wall, with rivets. */
function BrassStrapping() {
  const z = CHEST_D / 2 - WALL / 2 + 0.011;
  const bandH = CHEST_H + 0.04;
  const bandY = WALL + bandH / 2;
  const bandPositions: [number, number, number][] = [
    [-CHEST_W / 4, bandY, z],
    [CHEST_W / 4, bandY, z],
  ];
  return (
    <group>
      {bandPositions.map((p, i) => (
        <group key={`band-${i}`}>
          <mesh position={p} castShadow>
            <boxGeometry args={[0.12, bandH, 0.012]} />
            <meshStandardMaterial color={BRASS} roughness={0.42} metalness={0.85} />
          </mesh>
          {/* Rivets along the band */}
          {[0, 1, 2, 3, 4, 5].map((rIdx) => {
            const yOff = -bandH / 2 + 0.16 + rIdx * (bandH - 0.32) / 5;
            return (
              <mesh
                key={`rivet-${i}-${rIdx}`}
                position={[p[0], p[1] + yOff, p[2] + 0.008]}
                castShadow
              >
                <sphereGeometry args={[0.025, 12, 12]} />
                <meshStandardMaterial
                  color={BRASS_BRIGHT}
                  roughness={0.32}
                  metalness={0.92}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/** Brass corner brackets at the four front corners. */
function BrassCornerBrackets() {
  const brassMaterialProps = {
    color: BRASS,
    roughness: 0.42,
    metalness: 0.85,
  };
  const z = CHEST_D / 2 - WALL / 2 + 0.011;
  const corners: { pos: [number, number, number]; flipX: boolean; flipY: boolean }[] = [
    { pos: [-CHEST_W / 2 + 0.18, WALL + 0.18, z], flipX: false, flipY: false },
    { pos: [CHEST_W / 2 - 0.18, WALL + 0.18, z], flipX: true, flipY: false },
    { pos: [-CHEST_W / 2 + 0.18, WALL + CHEST_H - 0.18, z], flipX: false, flipY: true },
    { pos: [CHEST_W / 2 - 0.18, WALL + CHEST_H - 0.18, z], flipX: true, flipY: true },
  ];
  return (
    <group>
      {corners.map((c, i) => (
        <group key={`corner-${i}`} position={c.pos}>
          {/* Horizontal arm */}
          <mesh position={[c.flipX ? -0.14 : 0.14, c.flipY ? 0.1 : -0.1, 0]} castShadow>
            <boxGeometry args={[0.32, 0.06, 0.012]} />
            <meshStandardMaterial {...brassMaterialProps} />
          </mesh>
          {/* Vertical arm */}
          <mesh position={[c.flipX ? -0.1 : 0.1, c.flipY ? 0.14 : -0.14, 0]} castShadow>
            <boxGeometry args={[0.06, 0.32, 0.012]} />
            <meshStandardMaterial {...brassMaterialProps} />
          </mesh>
          {/* Rivet at the corner of the L */}
          <mesh position={[c.flipX ? -0.1 : 0.1, c.flipY ? 0.1 : -0.1, 0.008]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color={BRASS_BRIGHT} roughness={0.3} metalness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Brass lock plate centered low on the front, with keyhole. */
function LockPlate() {
  const z = CHEST_D / 2 - WALL / 2 + 0.011;
  const y = WALL + 0.34;
  return (
    <group position={[0, y, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.42, 0.014]} />
        <meshStandardMaterial color={BRASS} roughness={0.4} metalness={0.88} />
      </mesh>
      {/* Inner bevel */}
      <mesh position={[0, 0, 0.008]}>
        <boxGeometry args={[0.34, 0.34, 0.005]} />
        <meshStandardMaterial color={BRASS_BRIGHT} roughness={0.32} metalness={0.9} />
      </mesh>
      {/* Keyhole circle */}
      <mesh position={[0, 0.04, 0.012]}>
        <cylinderGeometry args={[0.04, 0.04, 0.005, 24]} />
        <meshStandardMaterial color="#1A1308" roughness={0.6} />
      </mesh>
      {/* Keyhole slot */}
      <mesh position={[0, -0.04, 0.012]}>
        <boxGeometry args={[0.025, 0.1, 0.006]} />
        <meshStandardMaterial color="#1A1308" roughness={0.6} />
      </mesh>
      {/* Four corner rivets */}
      {[
        [-0.17, 0.17],
        [0.17, 0.17],
        [-0.17, -0.17],
        [0.17, -0.17],
      ].map((p, i) => (
        <mesh key={`lock-rivet-${i}`} position={[p[0]!, p[1]!, 0.012]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color={BRASS_BRIGHT} roughness={0.3} metalness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

/** Open lid hinged at the back — tilted up by LID_OPEN_DEG. */
function ChestLid() {
  const lidGroup = useRef<THREE.Group>(null);
  return (
    <group
      ref={lidGroup}
      // Hinge at the back-top edge of the body. Translate so the lid's
      // back edge sits at z=-CHEST_D/2 and y=CHEST_H+WALL, then rotate
      // around X (which is the hinge axis).
      position={[0, WALL + CHEST_H, -CHEST_D / 2 + WALL / 2]}
      rotation-x={(-LID_OPEN_DEG * Math.PI) / 180}
    >
      {/* Translate forward so the box's "hinge edge" is at the rotation pivot */}
      <group position={[0, LID_THICKNESS / 2, CHEST_D / 2 - WALL / 2]}>
        {/* Lid slab */}
        <RoundedBox
          args={[CHEST_W, LID_THICKNESS, CHEST_D]}
          radius={0.04}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={SANDALWOOD_TOP}
            roughness={0.82}
            metalness={0.06}
          />
        </RoundedBox>
        {/* Mother-of-pearl Sadu inlay sits on the INSIDE face of the
            lid so it faces the camera when the lid swings open. The
            outer face stays plain sandalwood. */}
        <LidInlay />
        {/* Brass trim edges along the front + back of the lid top */}
        {[CHEST_D / 2 - 0.02, -CHEST_D / 2 + 0.02].map((zOff, i) => (
          <mesh
            key={`trim-${i}`}
            position={[0, LID_THICKNESS / 2 + 0.004, zOff]}
          >
            <boxGeometry args={[CHEST_W - 0.04, 0.008, 0.04]} />
            <meshStandardMaterial color={BRASS} roughness={0.4} metalness={0.85} />
          </mesh>
        ))}
        {/* Two brass hinge plates at the back edge */}
        {[-CHEST_W / 4, CHEST_W / 4].map((xOff, i) => (
          <mesh
            key={`hinge-${i}`}
            position={[xOff, -LID_THICKNESS / 2 + 0.012, -CHEST_D / 2 + 0.05]}
          >
            <boxGeometry args={[0.36, 0.08, 0.14]} />
            <meshStandardMaterial color={BRASS} roughness={0.42} metalness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Three mother-of-pearl Sadu diamond inlays on the INSIDE of the lid.
 *  When the lid swings open past vertical, this face turns toward the
 *  camera, so the inlay reads instantly. */
function LidInlay() {
  const diamonds: { x: number; size: number; opacity: number }[] = [
    { x: -CHEST_W / 3 + 0.1, size: 0.36, opacity: 0.92 },
    { x: 0, size: 0.5, opacity: 1 },
    { x: CHEST_W / 3 - 0.1, size: 0.36, opacity: 0.92 },
  ];
  // Inside face sits at y = -LID_THICKNESS/2 (one thickness below the
  // outer face). Rotation +π/2 around X faces the geometry's normal
  // toward -Y in lid-local space — which becomes "toward the camera"
  // when the lid is open at LID_OPEN_DEG > 90°.
  return (
    <group position={[0, -LID_THICKNESS / 2 - 0.006, 0]}>
      {/* Lid interior backing — sandalwood-deep, slightly inset from the
          edges so the wood frame reads around the inlay */}
      <mesh rotation-x={Math.PI / 2}>
        <planeGeometry args={[CHEST_W - 0.18, CHEST_D - 0.18]} />
        <meshStandardMaterial color={SANDALWOOD_DEEP} roughness={0.92} metalness={0.04} />
      </mesh>
      {diamonds.map((d, i) => (
        <group key={`mop-${i}`} position={[d.x, 0.001, 0]} rotation-x={Math.PI / 2}>
          <mesh rotation-z={Math.PI / 4}>
            <planeGeometry args={[d.size, d.size]} />
            <meshPhysicalMaterial
              color={MOP}
              metalness={0.05}
              roughness={0.22}
              clearcoat={0.95}
              clearcoatRoughness={0.18}
              iridescence={1}
              iridescenceIOR={1.32}
              iridescenceThicknessRange={[200, 760]}
              transparent
              opacity={d.opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Inner diamond outline (smaller, darker brass) */}
          <mesh rotation-z={Math.PI / 4} position={[0, 0, 0.001]}>
            <ringGeometry args={[d.size * 0.42, d.size * 0.46, 4]} />
            <meshStandardMaterial
              color="#5A4218"
              metalness={0.6}
              roughness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      {/* Two thin brass lines framing the inlay row */}
      {[-0.42, 0.42].map((zOff, i) => (
        <mesh
          key={`line-${i}`}
          position={[0, 0.002, zOff]}
          rotation-x={Math.PI / 2}
        >
          <planeGeometry args={[CHEST_W - 0.4, 0.014]} />
          <meshStandardMaterial color={BRASS} roughness={0.4} metalness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// --------------------------------------------------------------------
// Scene
// --------------------------------------------------------------------

function SceneContent({
  pearls,
  reducedMotion,
}: {
  pearls: { id: string; grade: PearlGrade }[];
  reducedMotion: boolean;
}) {
  const slots = useMemo(() => makeSlots(pearls), [pearls]);

  return (
    <>
      {/* Soft warm key light from above-front, simulating a lantern */}
      <ambientLight intensity={0.42} color="#F5E6C8" />
      <directionalLight
        position={[3.5, 5.5, 3.5]}
        intensity={2.4}
        color="#FFE4B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      {/* Cool fill from the back-left so wood doesn't go dead in shadow */}
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.7}
        color="#9FBFE0"
      />
      {/* Tiny rim from below — keeps the velvet from going pitch */}
      <pointLight position={[0, 0.4, 0]} intensity={0.6} color="#E8A33D" />

      <Environment preset="warehouse" environmentIntensity={0.45} />

      {/* Floor under the chest — a wide dim disc for shadow */}
      <mesh
        position={[0, -0.001, 0]}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#1A0E08" roughness={1} metalness={0} />
      </mesh>

      <ChestBody />
      <BrassStrapping />
      <BrassCornerBrackets />
      <LockPlate />
      <ChestLid />

      {slots.map((s) =>
        s.pearl ? (
          <Pearl
            key={s.pearl.id}
            grade={s.pearl.grade}
            position={s.position}
            reducedMotion={reducedMotion}
            index={s.index}
          />
        ) : null,
      )}

      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={reducedMotion ? 0.18 : 0.5}
          luminanceThreshold={0.62}
          luminanceSmoothing={0.18}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.18} darkness={0.46} />
      </EffectComposer>
    </>
  );
}

export default function PearlChest3D({
  pearls,
  reducedMotion = false,
  height = 460,
}: PearlChest3DProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 30%, #2A1A0E 0%, #100805 70%, #050302 100%)",
        boxShadow:
          "inset 0 2px 12px rgba(0,0,0,0.6), 0 18px 44px rgba(0,0,0,0.5)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        frameloop={active && !reducedMotion ? "always" : "demand"}
      >
        {/* Default camera angled down-and-forward so the open chest's
            interior — and the pearls inside — is visible the moment the
            scene mounts, no drag required. The OrbitControls target sits
            on the velvet floor, not the chest's mid-body, so the camera
            naturally tilts down into the contents. */}
        <PerspectiveCamera makeDefault position={[0, 4.2, 5.0]} fov={42} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4.5}
          maxDistance={9.0}
          minPolarAngle={Math.PI * 0.12}
          maxPolarAngle={Math.PI * 0.46}
          target={[0, WALL + 0.18, 0]}
          autoRotate={false}
          dampingFactor={0.08}
          enableDamping
        />
        <Suspense fallback={null}>
          <SceneContent pearls={pearls} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
