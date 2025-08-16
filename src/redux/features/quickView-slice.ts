import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: 0,
    name: "",
    category_slug: "",
    price: 0,
    model_name: null,
    brand: null,
    discount_b2b: null,
    discount_b2c: null,
    b2b_price: null,
    b2c_price: null,
    description: "",
    images: [],
    imgs: { thumbnails: [], previews: [] },
    published: true,
    reviews: 0,
  },
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },
    resetQuickView: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;
