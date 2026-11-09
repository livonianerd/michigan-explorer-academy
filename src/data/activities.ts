/** Original instructional examples, not archival records. */
export const timelineEvents = [
  { date: 1701, text: "French settlement established at Detroit" },
  { date: 1825, text: "Erie Canal opens" },
  { date: 1835, text: "Michigan voters approve a constitution" },
  { date: 1837, text: "Michigan becomes the 26th state" },
];
export const sourceCards = [
  {
    text: "An original diary written by a Michigan resident in 1835.",
    answer: 0,
    why: "A diary from the period provides firsthand evidence.",
  },
  {
    text: "A museum article written today explaining the 1835 diary.",
    answer: 1,
    why: "A later explanation interprets evidence from the past.",
  },
  {
    text: "A tool made and used in an early Michigan settlement.",
    answer: 0,
    why: "An original object is an artifact from the time.",
  },
  {
    text: "A modern history textbook about Michigan statehood.",
    answer: 1,
    why: "A textbook looks back and explains earlier events.",
  },
];
export const environmentEvidence = {
  title: "Compare the evidence",
  caption:
    "Invented instructional model — not a historical dataset or a description of all Indigenous communities.",
  columns: [
    "Practice community",
    "Spring activity",
    "Summer activity",
    "Use of water",
  ],
  rows: [
    ["Community A", "Harvesting maple sap", "Fishing", "Food and travel"],
    [
      "Settlement B",
      "Preparing fields",
      "Growing crops",
      "A water-powered mill",
    ],
  ],
  question:
    "What is one similarity and one difference? Which row supports your answer?",
  explanation:
    "Both communities depend on water. In this model, Community A fishes, while Settlement B uses a mill. Real historical comparisons need dated sources from a named community.",
};
export const timelineActivity = {
  title: "Build a journey through time",
  instructions:
    "Put these events in order, earliest first. Use the arrow buttons to move each card.",
  context:
    "Indigenous histories began long before these selected events and continue today.",
  initialOrder: [2, 0, 3, 1],
  success:
    "You did it! 1701 → 1825 → 1835 → 1837. Dates show order; evidence helps explain causes.",
  retry: "Keep exploring. Compare the dates and place the smallest year first.",
};
export const sourceActivity = {
  title: "What kind of source?",
  instructions:
    "Imagine investigating Michigan before statehood. Classify each example. These are descriptions for practice, not actual archival objects.",
  categories: ["Primary source", "Secondary source"],
};
