import { CrPumpDrawing, DistributorPumpDrawing, GlowPlugDrawing, InjectorDrawing, InlinePumpDrawing, TesterDrawing, TimingBeltDrawing } from './Drawings';

/** Illustration lookup for data-driven lists (see workshopJobs in src/data/content.ts). */
export const drawingsById = {
  tester: TesterDrawing,
  injector: InjectorDrawing,
  belt: TimingBeltDrawing,
  glowplug: GlowPlugDrawing,
  crpump: CrPumpDrawing,
  inline: InlinePumpDrawing,
  distributor: DistributorPumpDrawing,
} as const;
