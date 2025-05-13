import { StepStyleDTO } from "react-form-stepper/dist/components/Step/StepTypes";

export type Stages = {
  value: string;
  title: string;
  description: string;
};

export const targetCustomers = ["b2b", "b2c", "b2b2c", "enterprise"];
export const securities = ["equity", "debt", "hybrid", "derivative"];
export const stepsList = [
  { label: "Comapany", index: 0 },
  { label: "Industry", index: 1 },
  { label: "Customer", index: 2 },
  { label: "Valuation", index: 3 },
  { label: "Security", index: 4 },
];
export const businessModels = [
  'saas', 'transactional', 'marketplace', 'enterprise', 'subscription', 'usage-based', 'ecommerce', 'advertising'
];
export const stages: Stages[] = [
  {
    value: "ideal",
    title: "Ideal stage",
    description: "Brainstorming and validating problem statement",
  },
  {
    value: "pre-seed",
    title: "Pre-seed stage",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "seed",
    title: "Seed stage",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "series-a",
    title: "Series A",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "series-b",
    title: "Series B",
    description: "Building MVP (Minimum viable product)",
  },
  {
    value: "series-c",
    title: "Series C",
    description: "Building MVP (Minimum viable product)",
  },
];
// , children: "✓"

export const styleConfig = {
  activeBgColor: "#fff",
  activeTextColor: "#000",
  inactiveBgColor: "#1a1a1a",
  completedBgColor: "#2a2a2a",
  borderRadius: 0,
} as StepStyleDTO;