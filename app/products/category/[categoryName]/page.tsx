import axios from "axios";
import type { Product } from "@/scripts/Types";
import ProductGrid from "@/app/components/ProductGrid";

export const revalidate = 1800;

interface Props {
  params: any;
}

export default async function CategoryPage({ params }: Props) {
  let response;
  console.log("Category: ", params.categoryName.replace("-", " "));
  try {
    response = await axios({
      url: "http://localhost:3000/api/products",
      method: "POST",
      data: {
        method: "read",
        category: params.categoryName.replace("-", " "),
      },
    });
  } catch (e) {
    console.log("Issue getting productDetails: ", e);
  }

  const products: Product[] = response?.data;

  if (!products) {
    return <>Issue loading products for Category</>;
  }
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        {params.categoryName.split("-").join(" ")} Vapes
      </h1>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p style={{ textAlign: "center" }}>
          We currently have no vapes under that category.
        </p>
      )}
    </div>
  );
}
