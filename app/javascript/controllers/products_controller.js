import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="products"
export default class extends Controller {
  connect() {
    function formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }

    // Update the product's name or price when the contenteditable field loses focus
    document.querySelectorAll(".editable").forEach((editable) => {
      editable.addEventListener("blur", async function () {
        const model = this.dataset.model;
        const attribute = this.dataset.attribute;
        const url = this.dataset.url;
        let value = this.textContent.trim();

        if (attribute === "price") {
          value = parseFloat(value.replace(/[^0-9.]+/g, ""));
        }

        const data = new FormData();
        data.append(`${model}[${attribute}]`, value);

        const csrfToken = document.querySelector(
          "meta[name='csrf-token']"
        ).content;
        const response = await fetch(url, {
          method: "PATCH",
          headers: { "X-CSRF-Token": csrfToken },
          body: data,
          credentials: "same-origin",
        });

        const result = await response.json();
        if (result.status === "error") {
          alert(result.message);
        } else {
          if (attribute === "price") {
            this.textContent = formatCurrency(value);
            location.reload();
          }
        }
      });
    });

    document.querySelectorAll(".purchased_checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async function () {
        const url = this.dataset.url;
        const purchased = this.checked;

        const data = new FormData();
        data.append("product[purchased]", purchased);

        const csrfToken = document.querySelector(
          "meta[name='csrf-token']"
        ).content;
        const response = await fetch(url, {
          method: "PATCH",
          headers: { "X-CSRF-Token": csrfToken },
          body: data,
          credentials: "same-origin",
        });

        const result = await response.json();
        if (result.status === "error") {
          alert(result.message);
        } else {
          // Refresh the page to update the totals after marking a product as purchased or remaining
          location.reload();
        }
      });
    });
  }
}
