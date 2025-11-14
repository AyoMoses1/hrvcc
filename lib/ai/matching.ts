import { User } from '@/lib/types';

interface MatchScore {
  userId: string;
  score: number;
  reasons: string[];
}

/**
 * Simple rule-based matching algorithm for recommending connections
 * In production, this would use ML models or more sophisticated algorithms
 */
export function calculateMatches(currentUser: User, allUsers: User[]): MatchScore[] {
  const matches: MatchScore[] = [];

  for (const user of allUsers) {
    if (user.id === currentUser.id) continue;

    let score = 0;
    const reasons: string[] = [];

    // Same category bonus
    if (user.category === currentUser.category) {
      score += 10;
      reasons.push(`Both are ${user.category}s`);
    }

    // Same country bonus
    if (user.country === currentUser.country) {
      score += 15;
      reasons.push(`Both based in ${user.country}`);
    }

    // Skills overlap
    if (currentUser.skills && user.skills) {
      const commonSkills = currentUser.skills.filter((skill) =>
        user.skills?.includes(skill)
      );
      if (commonSkills.length > 0) {
        score += commonSkills.length * 5;
        reasons.push(`${commonSkills.length} common skills`);
      }
    }

    // Services match (for businesses)
    if (currentUser.services && user.services) {
      const commonServices = currentUser.services.filter((service) =>
        user.services?.includes(service)
      );
      if (commonServices.length > 0) {
        score += commonServices.length * 5;
        reasons.push(`${commonServices.length} similar services`);
      }
    }

    // Verified user bonus
    if (user.verified) {
      score += 5;
      reasons.push('Verified profile');
    }

    // High rating bonus
    if (user.rating && user.rating >= 4.5) {
      score += 8;
      reasons.push('Highly rated');
    }

    if (score > 0) {
      matches.push({
        userId: user.id,
        score,
        reasons,
      });
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Get top N recommendations for a user
 */
export function getRecommendations(
  currentUser: User,
  allUsers: User[],
  limit: number = 5
): MatchScore[] {
  const matches = calculateMatches(currentUser, allUsers);
  return matches.slice(0, limit);
}

