import { useEffect, useState, useContext } from "react";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import styles from "./admin.module.css";
import { ThriftContext } from "../../context/Context";
import { getAllProductApi, deleteProductApi, updateProductApi } from "../../utils/api";
// import { getAllProductApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const {
        state: { user },
    } = useContext(ThriftContext);
    const categories = ['All', 'Tops', 'Dresses', 'Accessories', 'Pants', 'Watches', 'Shoes'];

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [soldFilter, setSoldFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [reviewProducts, setReviewProducts] = useState([]);
    const [filteredReviewProducts, setFilteredReviewProducts] = useState([]);
    const [reviewCategoryFilter, setReviewCategoryFilter] = useState('All');
    const [reviewSearchTerm, setReviewSearchTerm] = useState('');


    useEffect(() => {
        if (user?.isAdmin === false) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [allProducts, categoryFilter, soldFilter, searchTerm]);

    useEffect(() => {
        filterReviewProducts();
    }, [allProducts, reviewCategoryFilter, reviewSearchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { status, data } = await getAllProductApi();
            if (status === 200) {
                setAllProducts(data.message);
                setReviewProducts(data.message.filter(product => product.reviewed == false));
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            console.log(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = allProducts;
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }
        if (soldFilter !== 'All') {
            filtered = filtered.filter(product => product.sold === (soldFilter === 'Sold'));
        }
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.desc.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(filtered);
    };

    const filterReviewProducts = () => {
        let filtered = reviewProducts;
        if (reviewCategoryFilter !== 'All') {
            filtered = filtered.filter(product => product.category === reviewCategoryFilter);
        }
        if (reviewSearchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
                product.desc.toLowerCase().includes(reviewSearchTerm.toLowerCase())
            );
        }
        setFilteredReviewProducts(filtered);
    };

    const handleDelete = async (productId, productName) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete "${productName}"?`);

        if (!isConfirmed) {
            return; // If user cancels, do nothing
        }

        try {
            const response = await deleteProductApi(productId);
            if (response.status === 200) {
                // Optimistically update the UI
                setAllProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
                setFilteredProducts(prevFiltered => prevFiltered.filter(product => product._id !== productId));
                alert("Product successfully deleted."); // Inform user of successful deletion
            } else if (response.status === 404) {
                console.log("Product not found. It may have been already deleted.");
                alert("Product not found. It may have been already deleted.");
                // Optionally, refresh the product list here to ensure UI is in sync with backend
                fetchProducts();
            } else {
                throw new Error("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error.message);
            alert("An error occurred while deleting the product. Please try again.");
        }
    };

    const handleVerifyAndBoost = async (productId, productName) => {
        const isConfirmed = window.confirm(`Are you sure you want to verify and boost "${productName}"?`);

        if (!isConfirmed) {
            return;
        }

        try {
            const response = await updateProductApi(productId, { reviewed: true });
            if (response.status === 200) {
                setReviewProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
                setFilteredReviewProducts(prevFiltered => prevFiltered.filter(product => product._id !== productId));
                alert("Product successfully verified and boosted.");
            } else {
                throw new Error("Failed to verify and boost product");
            }
        } catch (error) {
            console.error("Error verifying and boosting product:", error.message);
            alert("An error occurred while verifying and boosting the product. Please try again.");
        }
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
    };


    const renderProductTable = (products, actionButton) => (
        <table className={styles.productTable}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sold</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product._id} onClick={() => handleRowClick(product)}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.price}</td>
                        <td>{product.sold ? 'Yes' : 'No'}</td>
                        <td>
                            {actionButton(product)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className={styles.homepage_container}>
            <AdminNavbar />
            <div className={styles.tabs_container}>
                <button
                    className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Products
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'review' ? styles.active : ''}`}
                    onClick={() => setActiveTab('review')}
                >
                    Review Products
                </button>
            </div>
            <div className={styles.tab_content}>
                {activeTab === 'all' ? (
                    <div>
                        <div className={styles.filters}>

                            <div className={styles.filter}>
                                <label>Categories:</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className={styles.dropdown}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.filter}>
                                <label>Status:</label>
                                <select
                                    value={soldFilter}
                                    onChange={(e) => setSoldFilter(e.target.value)}
                                    className={styles.dropdown}
                                >
                                    <option value="All">All</option>
                                    <option value="Sold">Sold</option>
                                    <option value="Unsold">Unsold</option>
                                </select>
                            </div>
                            <div className={styles.filter}>
                                <label>Search</label>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <table className={styles.productTable}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Sold</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product._id} onClick={() => handleRowClick(product)}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{product.price}</td>
                                            <td>{product.sold ? 'Yes' : 'No'}</td>
                                            <td>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(product._id, product.name);
                                                    }}
                                                    className={styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className={styles.filters}>
                            <div className={styles.filter}>
                                <label>Categories:</label>
                                <select
                                    value={reviewCategoryFilter}
                                    onChange={(e) => setReviewCategoryFilter(e.target.value)}
                                    className={styles.dropdown}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.filter}>
                                <label>Search</label>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={reviewSearchTerm}
                                    onChange={(e) => setReviewSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            renderProductTable(filteredReviewProducts, (product) => (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVerifyAndBoost(product._id, product.name);
                                    }}
                                    className={styles.verifyBtn}
                                >
                                    Verify & Boost
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
            {selectedProduct && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{selectedProduct.name}</h2>
                        <img src={selectedProduct.image} alt={selectedProduct.name} className={styles.productImage} />
                        <p><strong>Description:</strong> {selectedProduct.desc}</p>
                        <p><strong>Price:</strong> {selectedProduct.price}</p>
                        <p><strong>Category:</strong> {selectedProduct.category}</p>
                        <p><strong>Condition:</strong> {selectedProduct.condition}</p>
                        <p><strong>Gender:</strong> {selectedProduct.gender}</p>
                        <p><strong>City:</strong> {selectedProduct.city}</p>
                        <p><strong>Sold:</strong> {selectedProduct.sold ? 'Yes' : 'No'}</p>
                        <button onClick={() => setSelectedProduct(null)} className={styles.closeBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;