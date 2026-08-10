// src/pages/admin/AdminProducts.jsx
import { useState, useEffect, useRef } from "react";
import { productService } from "../../services/api";
import { AdminSidebar } from "./AdminDashboard";
import { useToast } from "../../components/ui/Toast";
import "./Admin.css";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    rating: "",
    stock: 0,
    description: "",
    image: "",
    featured: false,
    trending: false,
  });

  const formRef = useRef(null);

  const { success, info } = useToast();
  const set = k => e => setForm({...form,[k]:e.target.value});

  useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    const response = await productService.getAll();

    setItems(response.data);

  } catch (err) {
    console.error(err);
  }
};

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    if (editItem) {
      await productService.update(editItem._id, {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
       stock: Number(form.stock),  
      featured: form.featured === "true" || form.featured === true,
      trending: form.trending === "true" || form.trending === true,
    });
      console.log("FORM BEFORE SAVE:", form);
      success(`${form.name} updated successfully`, "Product Updated");
    } else {
      await productService.create({
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
       stock: Number(form.stock), 
      featured: form.featured === "true" || form.featured === true,
      trending: form.trending === "true" || form.trending === true,
      reviews: 0,
      images: [],
    });

      success(`${form.name} added successfully`, "Product Added");
    }

    await loadProducts();

    window.scrollTo({
  top: 0,
  behavior: "smooth",
});

    setShowForm(false);
    setEditItem(null);

    setForm({
  name: "",
  brand: "",
  category: "",
  price: "",
  rating: "",
  stock: 0,
  description: "",
  image: "",
  featured: false,
  trending: false,
});

  } catch (err) {
    console.error(err);
  }
};

const handleEdit = (item) => {
  console.log("HANDLE EDIT CALLED");
    console.log(item);

  setEditItem(item);

  setForm({
  name: item.name,
  brand: item.brand,
  category: item.category,
  price: item.price,
  rating: item.rating,
  stock: item.stock,
  description: item.description || "",
  image: item.image || "",
  featured: item.featured || false,
  trending: item.trending || false,
});
  
  setShowForm(true);

  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

};


const handleDelete = async (_id, name) => {
  if (!window.confirm("Delete this product?")) return;

  try {
    await productService.delete(_id);

    await loadProducts();

    info(`${name} removed from catalog`, "Deleted");

  } catch (err) {
    console.error(err);
  }
};



  return (
    <div className="admin-page">
      <div className="admin-layout">
        <AdminSidebar active="products" />
        <div className="admin-content">
          <div className="admin-header flex-between">
            <div><h1 className="admin-title">Products</h1><p className="admin-subtitle">{items.length} products</p></div>
            <button className="btn btn-primary" 
             onClick={() => {
                setShowForm(true);
                setEditItem(null);

                setForm({
                  name: "",
                  brand: "",
                  category: "",
                  price: "",
                  rating: "",
                  stock: 0,
                  description: "",
                  image: "",
                  featured: false,
                  trending: false,
                });

              }}>+ Add Product</button>
          </div>

          {showForm && (
              <div
                ref={formRef}
                className="admin-card"
                style={{ marginBottom: "var(--space-xl)" }}
              >              
              <h3 className="admin-card-title">{editItem?"Edit Product":"Add New Product"}</h3>
              <form onSubmit={handleSave}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Name</label><input required className="form-input" value={form.name} onChange={set("name")} /></div>
                  <div className="form-group"><label className="form-label">Brand</label><input required className="form-input" value={form.brand} onChange={set("brand")} /></div>
                  <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={set("category")}><option value="">Select</option>{["Laptops","Headphones","Keyboards","Mice","Monitors","Smart Watches"].map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Price ($)</label><input required type="number" className="form-input" value={form.price} onChange={set("price")} /></div>
                  <div className="form-group"><label className="form-label">Rating</label><input type="number" step="0.1" min="0" max="5" className="form-input" value={form.rating} onChange={set("rating")} /></div>
                  <div className="form-group"><label className="form-label">Stock Quantity</label><input type="number" min="0" className="form-input" value={form.stock} onChange={set("stock")} /></div>                  
                  <div className="form-group">
                    <label className="form-label">Image URL</label>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Paste image URL here"
                      value={form.image}
                      onChange={set("image")}
                      required
                    />
                  </div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows="4" value={form.description} onChange={set("description")} /></div>
                  <div className="form-group"><label className="form-label">Featured</label><select className="form-select" value={form.featured} onChange={set("featured")}><option value={true}>Yes</option><option value={false}>No</option></select></div>
                  <div className="form-group"><label className="form-label">Trending</label><select className="form-select" value={form.trending} onChange={set("trending")}><option value={true}>Yes</option><option value={false}>No</option></select></div>
                </div>
                <div style={{display:"flex",gap:"var(--space-sm)"}}>
                  <button type="submit" className="btn btn-primary">Save Product</button>
                  <button type="button" className="btn btn-outline" 
                  onClick={() => {
                      setShowForm(false);
                      setEditItem(null);

                      setForm({
                        name: "",
                        brand: "",
                        category: "",
                        price: "",
                        rating: "",
                        stock: 0,
                        description: "",
                        image: "",
                        featured: false,
                        trending: false,
                      });
                    }} >Cancel</button>
                </div>
              </form>
            </div>
          )}


                  {items.length === 0 ? (
          <div className="admin-card">
            <p style={{ textAlign: "center", padding: "30px" }}>
              No products found.
            </p>
          </div>
        ) : (
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                            objectFit: "cover",
                          }}
                        />

                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {p.name}
                        </span>
                      </div>
                    </td>

                    <td>{p.brand}</td>

                    <td>{p.category}</td>

                    <td>${Number(p.price).toLocaleString()}</td>

                    <td>★ {p.rating}</td>

                    <td>
                      <span
                        className={`order-status status-${
                          p.stock > 0 ? "success" : "danger"
                        }`}
                      >
                        {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                        }}
                      >
                       <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            console.log("EDIT BUTTON CLICKED");
                            handleEdit(p);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p._id, p.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    
        </div>
      </div>
    </div>
  );
}
