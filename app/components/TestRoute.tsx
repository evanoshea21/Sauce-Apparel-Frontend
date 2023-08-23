"use client";
import React from "react";
import axios from "axios";

export default function TestRoute() {
  async function getProducts() {
    let response = await axios({
      url: "http://localhost:1400/products",
      method: "POST",
      data: {
        name: "Test-name",
        Category: "disposable",
      },
    });

    console.log("response /products: ", response);
  }
  return (
    <button
      style={{
        padding: "10px 20px",
        fontSize: "1.5rem",
      }}
      onClick={getProducts}
    >
      Test /products
    </button>
  );
}
