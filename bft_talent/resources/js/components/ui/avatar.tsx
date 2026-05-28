import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as React from "react"

import { cn } from "@/lib/utils"

const AVATAR_COLORS = ['#FF7607', '#9C4500', '#1D4ED8', '#0E7C4A', '#7C3AED', '#B45309', '#0891B2', '#BE185D'];

function avatarColor(name: string): string {
    let sum = 0;
    for (const ch of name) sum += ch.charCodeAt(0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

type BfaAvatarProps = {
    name: string;
    size?: number;
    color?: string;
    className?: string;
};

function BfaAvatar({ name, size = 32, color, className }: BfaAvatarProps) {
    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    const bg = color ?? avatarColor(name);
    const fontSize = Math.round(size * 0.38);

    return (
        <div
            className={cn("flex items-center justify-center rounded-full shrink-0", className)}
            style={{
                width: size,
                height: size,
                background: bg,
                color: '#fff',
                fontSize,
                fontWeight: 600,
                lineHeight: 1,
            }}
            title={name}
        >
            {initials}
        </div>
    );
}

export { Avatar, AvatarImage, AvatarFallback, BfaAvatar }
