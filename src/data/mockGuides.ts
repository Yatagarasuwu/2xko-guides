type GuideCategory = "official" | "community";

type ComboVariant = {
  label: string;
  payoff: string;
  recording: string;
};

type ComboPlan = {
  starter: string;
  route: string;
  focus: string;
  variants: ComboVariant[];
  notes: string[];
};

type MixupBranch = {
  label: string;
  description: string;
  recording: string;
  branches?: MixupBranch[];
};

type MixupSequence = {
  opening: string;
  setup: string;
  tree: MixupBranch;
};

type OkiPlan = {
  hitState: string;
  soloOption: string;
  assistOption: string;
  recording: string;
};

type NeutralPlan = {
  title: string;
  summary: string;
  bullets: string[];
  recording: string;
};

export type TeamGuide = {
  id: string;
  title: string;
  category: GuideCategory;
  author: string;
  summary: string;
  team: string[];
  published: string;
  recordings: number;
  concepts: {
    combos: ComboPlan[];
    mixups: MixupSequence;
    okizeme: OkiPlan[];
    neutral: NeutralPlan[];
  };
};

const featuredGuides: TeamGuide[] = [
  {
    id: "ahri-yasuo",
    title: "Ahri / Yasuo Guide",
    category: "official",
    author: "2XKO Guides Team",
    summary:
      "Rushdown pressure with layered assists, route choice, and corner-to-corner routing.",
    team: ["Ahri", "Yasuo"],
    published: "Updated weekly",
    recordings: 18,
    concepts: {
      combos: [
        {
          starter: "Any light starter",
          route: "Corner carry into assist restand",
          focus: "Best oki",
          notes: [
            "Works with either assist order.",
            "Preserves spacing for meaty pressure.",
          ],
          variants: [
            {
              label: "Assistless",
              payoff: "Simple knockdown with safe jump",
              recording: "L starter > launcher > ender A",
            },
            {
              label: "1 meter cashout",
              payoff: "Spend to kill if the route starts near 50%",
              recording: "L starter > meter ender > super",
            },
            {
              label: "Resource cashout",
              payoff: "Use team resource to keep corner and push damage",
              recording: "L starter > resource route > hard knockdown",
            },
          ],
        },
        {
          starter: "Counter hit 5H",
          route: "Assist extension into wall bounce",
          focus: "Damage",
          notes: [
            "Use when you already forced a high commit.",
            "Best for round-ending confirms.",
          ],
          variants: [
            {
              label: "Assistless",
              payoff: "Stable route into oki",
              recording: "CH 5H > launcher > ender B",
            },
            {
              label: "With assist",
              payoff: "Convert the wall bounce into a higher kill route",
              recording: "CH 5H > assist call > wall bounce",
            },
          ],
        },
      ],
      mixups: {
        opening: "Opponent blocks 5L",
        setup: "Call assist and hold forward pressure.",
        tree: {
          label: "Assist arrives",
          description:
            "The exact answer depends on how the opponent respects the assist call.",
          recording: "5L > assist call > pressure start",
          branches: [
            {
              label: "Frame trap",
              description:
                "Delay the next button to catch fuzzy buttons and throws.",
              recording: "5L > assist call > slight delay > 5M",
            },
            {
              label: "Throw",
              description: "Walk in and take the corner if they keep blocking.",
              recording: "5L > assist call > walk throw",
            },
            {
              label: "Cross-up route",
              description:
                "Use the assist to cover a side switch and make the blockstring ambiguous.",
              recording: "5L > assist call > jump cancel cross-up",
              branches: [
                {
                  label: "Low follow-up",
                  description:
                    "Convert the side switch into a low starter if they turn too late.",
                  recording: "cross-up > low confirm",
                },
                {
                  label: "Reset to strike",
                  description:
                    "Land and hit confirm if they try to chase the switch.",
                  recording: "cross-up > land > strike confirm",
                },
              ],
            },
          ],
        },
      },
      okizeme: [
        {
          hitState: "Any midscreen hard knockdown",
          soloOption: "Dash meaty into plus button",
          assistOption:
            "Call assist and cover a throw / strike split",
          recording: "HKD midscreen > dash up oki",
        },
        {
          hitState: "Corner slide knockdown",
          soloOption: "Short hop safe jump",
          assistOption: "Assist hold to create a left-right",
          recording: "Corner slide > meaty jump route",
        },
      ],
      neutral: [
        {
          title: "Midrange control",
          summary:
            "Use fast buttons to take space, then let the assist sharpen your approach.",
          bullets: [
            "Look for a whiff punish route into your safest conversion.",
            "Save meter for rounds where a neutral win can become a kill.",
          ],
          recording: "Midrange control example",
        },
        {
          title: "Assist-backed approach",
          summary:
            "Move with a purpose: the assist should force respect or cover your entry.",
          bullets: [
            "Pick one lane: air, ground, or call-and-stay.",
            "Do not spend team resources unless the hit leads somewhere useful.",
          ],
          recording: "Assist-backed neutral example",
        },
      ],
    },
  },
  {
    id: "jinx-ekko",
    title: "Jinx / Ekko Guide",
    category: "community",
    author: "Workshop contributor",
    summary:
      "Zoning and setplay with extended routes, delayed pressure, and simple gameplan calls.",
    team: ["Jinx", "Ekko"],
    published: "Community verified",
    recordings: 14,
    concepts: {
      combos: [
        {
          starter: "Projectile hit",
          route: "Screen carry into assist confirm",
          focus: "Assistless or with assist",
          notes: [
            "Lets you keep the screen and still build a knockdown.",
            "Easy to label by starting hit.",
          ],
          variants: [
            {
              label: "Assistless",
              payoff: "Reliable knockdown with space advantage",
              recording: "projectile hit > confirm > ender",
            },
            {
              label: "With assist",
              payoff: "Use assist to stabilize a longer confirm",
              recording: "projectile hit > assist > confirm route",
            },
            {
              label: "1 meter cashout",
              payoff: "Spend meter to convert the same hit into a finish",
              recording: "projectile hit > super ender",
            },
          ],
        },
      ],
      mixups: {
        opening: "Opponent blocks a 5L",
        setup: "Call the assist and threaten a delayed restart.",
        tree: {
          label: "Assist covers the next beat",
          description:
            "Use the timing to branch into either a strike or a reset.",
          recording: "5L > assist > branching pressure",
          branches: [
            {
              label: "Delayed overhead",
              description:
                "Catch people trying to stand after the assist call.",
              recording: "5L > assist > delayed overhead",
            },
            {
              label: "Stagger button",
              description:
                "Reset pressure with a tight stagger into a new hit check.",
              recording: "5L > assist > stagger confirm",
            },
          ],
        },
      },
      okizeme: [
        {
          hitState: "Anywhere knockdown",
          soloOption: "Set a trap and hold the corner line",
          assistOption:
            "Have assist occupy the jump lane while you dash in",
          recording: "Trap setup oki",
        },
      ],
      neutral: [
        {
          title: "Lane denial",
          summary:
            "Make the opponent move through projectiles, then convert when they get impatient.",
          bullets: [
            "Track where the opponent wants to jump.",
            "Force them to spend their best movement before you spend your own.",
          ],
          recording: "Lane denial neutral",
        },
      ],
    },
  },
];

function titleCaseSlug(id: string) {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" / ");
}

function createDraftGuide(id: string): TeamGuide {
  const team = id
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1));
  const title =
    team.length === 2
      ? `${team[0]} / ${team[1]} Workshop`
      : `${titleCaseSlug(id)} Workshop`;
  const opening =
    team.length === 2
      ? `Opponent blocks a ${team[0]} 5L`
      : "Opponent blocks a starter";

  return {
    id,
    title,
    category: "community",
    author: "Custom build",
    summary:
      "A draft workspace for the selected duo. Replace each note with verified recordings and route labels.",
    team: team.length > 0 ? team : ["Team 1", "Team 2"],
    published: "Draft workspace",
    recordings: 0,
    concepts: {
      combos: [
        {
          starter: "Any hit that matters",
          route: "Build the best route for your win condition",
          focus: "Best oki / cashout / assist choice",
          notes: [
            "Mark the starter, the conversion, and the ender.",
            "Attach a recording for each variant.",
          ],
          variants: [
            {
              label: "Assistless",
              payoff: "Fastest route with the fewest moving parts",
              recording: "Add recording URL",
            },
            {
              label: "With assist",
              payoff: "Route that spends the assist to improve conversion",
              recording: "Add recording URL",
            },
            {
              label: "1 meter cashout",
              payoff: "Spend meter to close the round",
              recording: "Add recording URL",
            },
          ],
        },
      ],
      mixups: {
        opening,
        setup:
          "Write the exact blockstring, assist call, or reset that starts the tree.",
        tree: {
          label: "First decision",
          description:
            "Branch the sequence from here and cover every answer.",
          recording: "Add recording URL",
          branches: [
            {
              label: "Strike",
              description: "Primary hit option.",
              recording: "Add recording URL",
            },
            {
              label: "Throw",
              description: "Primary throw option.",
              recording: "Add recording URL",
            },
          ],
        },
      },
      okizeme: [
        {
          hitState: "Knockdown 1",
          soloOption: "Write your solo oki route here",
          assistOption: "Write your assist-backed option here",
          recording: "Add recording URL",
        },
      ],
      neutral: [
        {
          title: "Team gameplan",
          summary:
            "Keep the neutral notes short and direct so the team identity stays readable.",
          bullets: [
            "What ranges do you win.",
            "What does each assist protect.",
            "What is the route to a clean hit.",
          ],
          recording: "Add recording URL",
        },
      ],
    },
  };
}

export const guides = featuredGuides;

export const guideDirectory = featuredGuides;

export function getGuideById(id: string) {
  return guideDirectory.find((guide) => guide.id === id) ?? createDraftGuide(id);
}

export function formatTeamTitle(id: string) {
  return titleCaseSlug(id);
}