/**
 * Bet Model Interface
 * Represents bet data structure
 */
export interface IBet {
  id: string;
  userId: string;
  amount: number;
  odds: number;
  status: BetStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bet Status Enum
 */
export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled',
}

/**
 * Bet Model Class
 * Represents a bet entity
 */
export class Bet implements IBet {
  id: string;
  userId: string;
  amount: number;
  odds: number;
  status: BetStatus;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Constructor
   * @param data - Bet data
   */
  constructor(data: Partial<IBet>) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.amount = data.amount || 0;
    this.odds = data.odds || 0;
    this.status = data.status || BetStatus.PENDING;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
