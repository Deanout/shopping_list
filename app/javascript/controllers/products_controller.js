import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.setupEditableFields();
    this.setupPurchasedCheckboxes();
  }

  async updateFieldValue(url, attribute, value) {
    const data = new FormData();
    data.append(attribute, value);

    const csrfToken = document.querySelector("meta[name='csrf-token']").content;

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
      return result;
    }
  }

  async updateField(editable) {
    const model = editable.dataset.model;
    const attribute = editable.dataset.attribute;
    const url = editable.dataset.url;
    let value = editable.textContent.trim();

    if (attribute === "price") {
      value = parseFloat(value.replace(/[^0-9.]+/g, ""));
    }

    const result = await this.updateFieldValue(
      url,
      `${model}[${attribute}]`,
      value
    );

    if (result && attribute === "price") {
      this.updatePriceField(editable, value);
      location.reload();
    }
  }

  updatePriceField(editable, value) {
    const formattedValue = this.formatCurrency(value);
    editable.textContent = formattedValue;
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  setupEditableFields() {
    document.querySelectorAll(".editable").forEach((editable) => {
      editable.addEventListener("blur", () => this.updateField(editable));
    });
  }

  async updatePurchasedCheckbox(url, purchased) {
    const result = await this.updateFieldValue(
      url,
      "product[purchased]",
      purchased
    );

    if (result) {
      location.reload();
    }
  }

  setupPurchasedCheckboxes() {
    document.querySelectorAll(".purchased_checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const url = checkbox.dataset.url;
        const purchased = checkbox.checked;
        this.updatePurchasedCheckbox(url, purchased);
      });
    });
  }
}
