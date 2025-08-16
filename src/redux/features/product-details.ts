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

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
