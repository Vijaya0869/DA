import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Image } from './image.entity';
@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  state: string;

  @Column({ nullable: false })
  zip_code: string;

  @Column({ nullable: true })
  property_type: string;

  @Column({ nullable: true })
  lot_size_type: string;

  @Column({ nullable: true })
  investment_strategy_id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  tags_n_labels: string;

  @Column({ nullable: true })
  zoning: string;

  @Column({ nullable: true })
  mls_number: string;

  @Column({ nullable: true })
  purchase_price: number;

  @Column({ nullable: true })
  closing_costs: number;

  @Column({ nullable: true })
  clear_closing_itemize_costs: boolean;

  @Column({ nullable: true })
  purchase_costs: number;

  @Column({ nullable: true })
  clear_purchase_itemize_costs: boolean;

  @Column({ nullable: true })
  after_repair_value: number;

  @Column({ nullable: true })
  rehab_cost_overrun: number;

  @Column({ nullable: true })
  rehab_cost_holding_period: number;

  @Column({ nullable: true })
  rehab_costs: number;

  @Column({ nullable: true })
  clear_rehab_itemize_costs: boolean;

  @Column({ nullable: true })
  selling_costs: number;

  @Column({ nullable: true })
  clear_selling_itemize_costs: boolean;

  @Column({ nullable: true })
  holding_costs: number;

  @Column({ nullable: true })
  clear_holding_itemize_costs: boolean;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  parking: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column({ nullable: true })
  year_built: number;

  @Column({ nullable: true })
  listing_price: number;

  @Column({ nullable: true })
  estimated_arv: number;

  @Column({ nullable: true })
  estimated_rent: number;

  @Column({ nullable: true })
  square_feet: number;

  @Column({ nullable: true })
  lot_size: number;

  @Column({ nullable: false })
  property_type_id: string;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  updatedAt: Date;

  @Column({ nullable: true, default: false })
  is_favorite: boolean;

  @Column({ nullable: true })
  geocode_response: string;

  @Column({ nullable: true })
  full_address: string;

  @Column({ nullable: true })
  property_unique_id: string;

  @Column({ nullable: true })
  geocode: string;

  @Column({ nullable: true })
  closing_costs_type: string;

  @Column({ nullable: true })
  rehab_costs_type: string;

  @Column({ nullable: true })
  selling_costs_type: string;

  @Column({ nullable: true })
  purchase_costs_type: string;

  @Column({ nullable: true })
  calc_closing_costs: number;

  @Column({ nullable: true })
  calc_purchase_costs: number;

  @Column({ nullable: true })
  calc_rehab_costs: number;

  @Column({ nullable: true })
  calc_selling_costs: number;

  @Column({ nullable: true })
  calc_holding_costs: number;

  @Column({ nullable: true })
  holding_costs_type: string;

  @Column({ nullable: true })
  arv: number;

  thumbnail_image: Image;
}
