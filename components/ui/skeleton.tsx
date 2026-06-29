import { cn } from "@/utils/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("shimmer rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}

export { Skeleton };
