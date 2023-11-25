import type { Product } from "@/scripts/Types";
import ProductGrid from "@/app/components/ProductGrid";
import { axiosCall } from "@/app/utils";

export const revalidate = 60;

interface Props {
  params: any;
}

export default async function CategoryPage({ params }: Props) {
  let response;
  // console.log("Category: ", params.categoryName.replace("-", " "));
  try {
    response = await axiosCall({
      url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/products`,
      method: "POST",
      data: {
        method: "read",
        category: params.categoryName.replace("-", " "),
      },
    });
  } catch (e) {
    console.log("Issue getting productDetails: ", e);
  }

  const products: Product[] = response;

  if (!products) {
    return <>Issue loading products for Category</>;
  }
  return (
    <div
      style={{
        margin: "0 30px",
        // border: "1px solid red",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        {params.categoryName.split("-").join(" ")}
      </h1>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <>
          <p style={{ textAlign: "center" }}>
            We currently have no apparel under that category.
          </p>
          <div style={{ height: "70vh" }}></div>
        </>
      )}
    </div>
  );
}
