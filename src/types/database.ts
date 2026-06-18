export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name_en: string;
          name_kn: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name_en: string;
          name_kn: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name_en?: string;
          name_kn?: string;
          slug?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          created_at: string;
          delivery_address: string;
          delivery_name: string;
          delivery_phone: string;
          delivery_pincode: string;
          id: string;
          items: Json;
          notes: string | null;
          order_number: string;
          status: string;
          total: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          delivery_address: string;
          delivery_name: string;
          delivery_phone: string;
          delivery_pincode: string;
          id?: string;
          items?: Json;
          notes?: string | null;
          order_number: string;
          status?: string;
          total: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          delivery_address?: string;
          delivery_name?: string;
          delivery_phone?: string;
          delivery_pincode?: string;
          id?: string;
          items?: Json;
          notes?: string | null;
          order_number?: string;
          status?: string;
          total?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          category_id: string | null;
          created_at: string;
          description_en: string | null;
          description_kn: string | null;
          id: string;
          images: string[] | null;
          in_stock: boolean;
          is_featured: boolean;
          name_en: string;
          name_kn: string;
          price: number;
          slug: string;
          unit: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          description_en?: string | null;
          description_kn?: string | null;
          id?: string;
          images?: string[] | null;
          in_stock?: boolean;
          is_featured?: boolean;
          name_en: string;
          name_kn: string;
          price: number;
          slug: string;
          unit?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          description_en?: string | null;
          description_kn?: string | null;
          id?: string;
          images?: string[] | null;
          in_stock?: boolean;
          is_featured?: boolean;
          name_en?: string;
          name_kn?: string;
          price?: number;
          slug?: string;
          unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      user_profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
