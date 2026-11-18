/** A single shared, eligible source owner receives the review. Ambiguity stays in the admin queue. */
export function resolveSourceReviewOwner(
  evidence: readonly {sourceId?: string; sourceRevisionId?: string}[],
  sources: readonly {id: string; revisionId: string; ownerUserId?: string | null}[],
  eligibleOwners: ReadonlySet<string>,
): string | null {
  if (!evidence.length) return null;
  const owners = evidence.map(item => sources.find(source =>
    item.sourceId ? source.id === item.sourceId : source.revisionId === item.sourceRevisionId,
  )?.ownerUserId);
  const owner = owners[0];
  return owner && eligibleOwners.has(owner) && owners.every(value => value === owner) ? owner : null;
}
