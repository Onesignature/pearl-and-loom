import { TAPESTRY_25 } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import { PEARL_TIERS } from "@/lib/pearl/colors";

interface TapestryStripProps {
  woven?: number;
  height?: number;
}

export function TapestryStrip({ woven = 3, height = 56 }: TapestryStripProps) {
  return (
    <div
      className="ltr-internal"
      style={{
        display: "flex",
        width: "100%",
        height,
        border: "1px solid rgba(240,228,201,0.2)",
        background: "var(--charcoal)",
        overflow: "hidden",
      }}
    >
      {TAPESTRY_25.map((row, i) => {
        const isWoven = i < woven;
        const isNext = i === woven;
        const Motif = MOTIF_COMPONENTS[row.motif];
        const isLast = i === TAPESTRY_25.length - 1;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              position: "relative",
              opacity: isWoven ? 1 : isNext ? 0.4 : 0.08,
              borderInlineEnd: isLast ? "none" : "1px solid rgba(0,0,0,0.15)",
            }}
          >
            {isWoven && Motif ? (
              <Motif {...row.palette} w="100%" h="100%" />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "var(--warp-lines)",
                  opacity: isNext ? 0.6 : 0.3,
                }}
              />
            )}
            {row.pearl && isWoven && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: PEARL_TIERS[row.pearl].cssVar,
                  boxShadow: "0 0 6px rgba(244,184,96,0.6)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
