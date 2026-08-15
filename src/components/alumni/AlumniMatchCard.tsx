import { BadgeCheck, Building2, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { initials } from "@/lib/alumnex";
import type { MatchResult } from "@/services/matching";

export type AlumniMatchCardProps = {
  name: string;
  avatarUrl?: string | null;
  designation?: string | null;
  companyName?: string | null;
  location?: string | null;
  verified?: boolean;
  skills: string[];
  match?: MatchResult;
};

export function AlumniMatchCard({
  name,
  avatarUrl,
  designation,
  companyName,
  location,
  verified,
  skills,
  match,
}: AlumniMatchCardProps) {
  return (
    <Card className="h-full shadow-card transition-shadow hover:shadow-lift">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-11">
            {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate font-medium">{name}</p>
              {verified && <BadgeCheck className="size-4 shrink-0 text-success" aria-label="Verified alumnus" />}
            </div>
            <p className="truncate text-sm text-muted-foreground">{designation}</p>
          </div>
          {match && (
            <div className="text-right">
              <p className="font-display text-xl font-semibold text-ai">{match.matchScore}%</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">match</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {companyName && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3" /> {companyName}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {location}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s) => (
            <Badge key={s} variant="secondary" className="font-normal">
              {s}
            </Badge>
          ))}
        </div>

        {match && (
          <div className="mt-auto space-y-2">
            <Progress value={match.matchScore} className="h-1.5" />
            <ul className="space-y-1 text-xs text-muted-foreground">
              {match.explanation.slice(0, 2).map((e) => (
                <li key={e}>✓ {e}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
