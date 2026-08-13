import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
    ArrowDown,
    ArrowRight,
    Heart,
    Menu,
    Minus,
    Plus,
    Search,
    ShoppingBag,
    Sparkles,
    X,
    UserRound,
    LogOut,
    Package,
    Pencil,
    Trash2,
    Star
} from "lucide-react";
import {
    authApi,
    productApi,
    cartApi,
    wishlistApi,
    reviewApi
} from "./api";
import "./luxury.css";
import { getImageUrl } from "./api";

const CATEGORIES = ["ALL", "NECKLACES", "RINGS", "EARRINGS", "BRACELETS"];

const fallbackProducts = [
    {
        _id: "demo-1",
        name: "Carabiner Diamond Necklace",
        category: "NECKLACES",
        tag: "NEW",
        price: 2490,
        img: "/jewellery-necklace.png",
        desc: "18k gold chain with pavé diamond lock pendant."
    },
    {
        _id: "demo-2",
        name: "Signature Link Necklace",
        category: "NECKLACES",
        tag: "BESTSELLER",
        price: 2190,
        img: "/jewellery-model.png",
        desc: "Polished sculptural links with a diamond-set clasp."
    },
    {
        _id: "demo-3",
        name: "Sculpted Button Earrings",
        category: "EARRINGS",
        tag: "NEW",
        price: 890,
        img: "/jewellery-model.png",
        desc: "High-polish 18k gold studs with an architectural curve."
    },
    {
        _id: "demo-4",
        name: "Velora Solitaire Ring",
        category: "RINGS",
        tag: "LIMITED",
        price: 1280,
        img: "/jewellery-necklace.png",
        desc: "A brilliant solitaire framed by a hand-finished gold band."
    }
];

const money = (value) =>
    `$${Number(value || 0).toLocaleString("en-US")}`;

function App() {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [authPage, setAuthPage] = useState(null);
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState("ALL");
    const [quickProduct, setQuickProduct] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [sellerOpen, setSellerOpen] = useState(false);
    const [filmOpen, setFilmOpen] = useState(false);
    const [message, setMessage] = useState(null);

    

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3200);
    };

    const loadProducts = async () => {
        try {
            const data = await productApi.all();
            setProducts(data.products || []);
        } catch {
            setProducts(fallbackProducts);
            showMessage("Backend unavailable. Showing demo products.", "error");
        }
    };

    const loadUserData = async (currentUser) => {
        if (!currentUser) {
            setCart([]);
            setWishlist([]);
            return;
        }

        try {
            const [cartData, wishData] = await Promise.all([
                cartApi.get(),
                wishlistApi.get()
            ]);
            setCart(cartData.cart || []);
            setWishlist(wishData.wishList || []);
        } catch (error) {
            showMessage(error.message, "error");
        }
    };

    useEffect(() => {
        loadProducts();

        authApi.me()
            .then((data) => {
                setUser(data.user);
                return loadUserData(data.user);
            })
            .catch(() => {})
            .finally(() => setLoadingUser(false));
    }, []);

    const filteredProducts = useMemo(() => {
        if (category === "ALL") return products;
        return products.filter((p) => {
            const value = `${p.category || ""} ${p.name || ""}`.toUpperCase();
            return value.includes(category);
        });
    }, [products, category]);

    const cartTotal = cart.reduce((sum, product) => sum + Number(product.price || 0), 0);

    const handleLogin = async (payload) => {
        const data = await authApi.login(payload);
        setUser(data.user);
        await loadUserData(data.user);
        setAuthPage(null);
        showMessage("Welcome back to VELORA®.");
    };

    const handleRegister = async (payload) => {
        const data = await authApi.register(payload);
        setUser(data.user);
        await loadUserData(data.user);
        setAuthPage(null);
        showMessage(`${data.user.role.toUpperCase()} account created.`);
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
            setUser(null);
            setCart([]);
            setWishlist([]);
            setSellerOpen(false);
            showMessage("You have been signed out.");
        } catch (error) {
            showMessage(error.message, "error");
        }
    };

    const requireLogin = (action) => {
        if (!user) {
            setAuthPage("login");
            return;
        }
        action();
    };

    const addToCart = async (product) => {
        requireLogin(async () => {
            try {
                const data = await cartApi.add(product._id);
                setCart(data.cart || []);
                setCartOpen(true);
                showMessage("Added to your bag.");
            } catch (error) {
                showMessage(error.message, "error");
            }
        });
    };

    const removeFromCart = async (id) => {
        try {
            const data = await cartApi.remove(id);
            setCart(data.cart || []);
            showMessage("Removed from bag.");
        } catch (error) {
            showMessage(error.message, "error");
        }
    };

    const toggleWishlist = async (product) => {
        requireLogin(async () => {
            try {
                const data = await wishlistApi.toggle(product._id);
                setWishlist(data.wishList || []);
                showMessage(data.liked ? "Saved to wishlist." : "Removed from wishlist.");
            } catch (error) {
                showMessage(error.message, "error");
            }
        });
    };

    const isLiked = (productId) =>
        wishlist.some((item) =>
            String(item._id || item) === String(productId)
        );

    if (loadingUser) {
        return <div className="loading-screen">VELORA®</div>;
    }

    return (
        <div className="app">
            {message && (
                <div className={`toast ${message.type}`}>
                    {message.text}
                </div>
            )}

            <Header
                user={user}
                cartCount={cart.length}
                onLogin={() => setAuthPage("login")}
                onSignup={() => setAuthPage("signup")}
                onLogout={handleLogout}
                onCart={() => requireLogin(() => setCartOpen(true))}
                onMenu={() => setMenuOpen(true)}
                onSeller={() => setSellerOpen(true)}
                onFilm={() => setFilmOpen(true)}
            />

            <Hero
                onExplore={() =>
                    document
                        .getElementById("collection")
                        ?.scrollIntoView({ behavior: "smooth" })
                }
            />

            <section id="collection" className="collection">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow dark">THE COLLECTION</p>
                        <h2>Quietly <em>extraordinary.</em></h2>
                    </div>
                    <p className="section-intro">
                        Considered fine jewellery in warm gold, luminous stones
                        and sculptural silhouettes.
                    </p>
                </div>

                <div className="category-row">
                    {CATEGORIES.map((item) => (
                        <button
                            key={item}
                            className={category === item ? "active" : ""}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="product-grid">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            index={index}
                            liked={isLiked(product._id)}
                            onLike={() => toggleWishlist(product)}
                            onQuick={() => setQuickProduct(product)}
                            onAdd={() => addToCart(product)}
                        />
                    ))}
                </div>
            </section>

            <BrandStory />

            <footer className="footer">
                <div className="footer-brand">VELORA®</div>
                <div className="footer-copy">
                    FINE JEWELLERY, CONSIDERED FOR A LIFETIME.
                </div>
                <div className="footer-links">
                    <span>PRIVACY</span>
                    <span>CONTACT</span>
                    <span>INSTAGRAM</span>
                </div>
                <div className="footer-bottom">
                    <span>VELORA® 2026</span>
                    <span>CRAFTED WITH INTENTION</span>
                </div>
            </footer>

            {authPage && (
                <AuthPage
                    type={authPage}
                    onClose={() => setAuthPage(null)}
                    onSwitch={(page) => setAuthPage(page)}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                />
            )}

            {quickProduct && (
                <QuickLook
                    product={quickProduct}
                    liked={isLiked(quickProduct._id)}
                    onLike={() => toggleWishlist(quickProduct)}
                    onClose={() => setQuickProduct(null)}
                    onAdd={() => {
                        setQuickProduct(null);
                        addToCart(quickProduct);
                    }}
                />
            )}

            {cartOpen && (
                <CartDrawer
                    cart={cart}
                    total={cartTotal}
                    onClose={() => setCartOpen(false)}
                    onRemove={removeFromCart}
                />
            )}

            {sellerOpen && user?.role === "seller" && (
                <SellerDashboard
    user={user}
    onClose={() => setSellerOpen(false)}
    showMessage={showMessage}
/>
            )}

            {filmOpen && (
                <CinematicFilm onClose={() => setFilmOpen(false)} />
            )}

            {menuOpen && (
                <MobileMenu
                    user={user}
                    onClose={() => setMenuOpen(false)}
                    onLogin={() => {
                        setMenuOpen(false);
                        setAuthPage("login");
                    }}
                    onSignup={() => {
                        setMenuOpen(false);
                        setAuthPage("signup");
                    }}
                    onLogout={() => {
                        setMenuOpen(false);
                        handleLogout();
                    }}
                    onSeller={() => {
                        setMenuOpen(false);
                        setSellerOpen(true);
                    }}
                    onFilm={() => {
                        setMenuOpen(false);
                        setFilmOpen(true);
                    }}
                    onCategory={(value) => {
                        setCategory(value);
                        setMenuOpen(false);
                        setTimeout(() => {
                            document
                                .getElementById("collection")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                    }}
                />
            )}
        </div>
    );
}

function Header({
    user,
    cartCount,
    onLogin,
    onSignup,
    onLogout,
    onCart,
    onMenu,
    onSeller,
    onFilm
}) {
    return (
        <header className="site-header">
            <button
                className="brand"
                onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }
            >
                VELORA<span>®</span>
            </button>

            <nav className="desktop-nav">
                <button onClick={onFilm}>THE FILM</button>
                <button onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}>NEW COLLECTION</button>
                <button onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}>RINGS</button>
                <button onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}>NECKLACES</button>
                <button onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}>EARRINGS</button>
            </nav>

            <div className="header-actions">
                {user ? (
                    <>
                        <span className="user-chip">
                            <UserRound size={14} />
                            {user.username}
                        </span>

                        {user.role === "seller" && (
                            <button className="header-text-btn" onClick={onSeller}>
                                SELLER
                            </button>
                        )}

                        <button className="header-icon" onClick={onLogout} title="Logout">
                            <LogOut size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <button className="header-text-btn" onClick={onLogin}>LOGIN</button>
                        <button className="header-text-btn signup-header" onClick={onSignup}>SIGN UP</button>
                    </>
                )}

                <button className="header-icon" title="Search">
                    <Search size={17} />
                </button>

                <button className="cart-btn" onClick={onCart}>
                    <ShoppingBag size={17} />
                    CART
                    <b>{cartCount}</b>
                </button>

                <button className="header-icon mobile-menu-button" onClick={onMenu}>
                    <Menu size={19} />
                </button>
            </div>
        </header>
    );
}

function Hero({ onExplore }) {
    return (
        <section className="hero">
            <div className="hero-image hero-a" />
            <div className="hero-image hero-b" />
            <div className="hero-vignette" />

            <div className="hero-content">
                <p className="eyebrow">VELORA® / 2026 COLLECTION</p>
                <h1>
                    Timeless pieces.<br />
                    <em>Made to be remembered.</em>
                </h1>
                <p className="hero-copy">
                    Fine jewellery designed around light, movement and the
                    quiet confidence of the woman who wears it.
                </p>
                <button className="gold-pill" onClick={onExplore}>
                    DISCOVER COLLECTION <ArrowRight size={15} />
                </button>
            </div>

            <div className="hero-scroll">
                <ArrowDown size={15} /> SCROLL TO EXPLORE
            </div>

            <div className="hero-product-note">
                <span>01 / COLLECTION</span>
                <strong>CARABINER DIAMOND NECKLACE</strong>
                <small>18K GOLD · PAVÉ DIAMONDS</small>
            </div>
        </section>
    );
}

function ProductCard({ product, liked, onLike, onQuick, onAdd, index }) {
    return (
        <article
            className="product-card"
            style={{ "--delay": `${index * 60}ms` }}
        >
            <div className="product-media">
                <img
                    src={getImageUrl(product.img)|| "/jewellery-necklace.png"}
                    alt={product.name}
                />

                <span className="product-tag">
                    {product.tag || (index % 2 ? "BESTSELLER" : "NEW")}
                </span>

                <button className={`heart-btn ${liked ? "liked" : ""}`} onClick={onLike}>
                    <Heart size={17} fill={liked ? "currentColor" : "none"} />
                </button>

                <div className="card-actions">
                    <button onClick={onQuick}>QUICK LOOK</button>
                    <button onClick={onAdd}>
                        <ShoppingBag size={14} /> ADD
                    </button>
                </div>
            </div>

            <div className="product-meta">
                <div>
                    <span>{product.category || "FINE JEWELLERY"}</span>
                    <h3>{product.name}</h3>
                </div>
                <strong>{money(product.price)}</strong>
            </div>

            <p className="product-desc">{product.desc}</p>
        </article>
    );
}

function BrandStory() {
    return (
        <section className="story">
            <div className="story-image" />
            <div className="story-content">
                <p className="eyebrow">THE VELORA STANDARD</p>
                <h2>
                    Gold, light<br />
                    <em>and intention.</em>
                </h2>
                <p>
                    Every VELORA piece is designed to live close to the skin.
                    Sculptural forms meet hand-set stones and considered
                    proportions, creating jewellery that feels effortless.
                </p>
                <button className="text-link">
                    OUR CRAFT <ArrowRight size={15} />
                </button>
            </div>
        </section>
    );
}

function AuthPage({ type, onClose, onSwitch, onLogin, onRegister }) {
    const login = type === "login";
    const [role, setRole] = useState("buyer");
    const [form, setForm] = useState({

    username: "",
    email: "",
    password: "",
    confirmPassword: ""

});
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const change = (key, value) =>
        setForm((current) => ({ ...current, [key]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!login && form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!login && form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setSubmitting(true);

            if (login) {
                await onLogin({
                    username: form.username,
                    password: form.password
                });
            } else {
                await onRegister({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    role
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-screen">
            <div className="auth-visual">
                <div className="auth-image" />
                <div className="auth-visual-shade" />
                <div className="auth-brand">VELORA<span>®</span></div>

                <div className="auth-visual-copy">
                    <p className="eyebrow">THE VELORA EXPERIENCE</p>
                    <h1>
                        Jewellery that<br />
                        <em>stays with you.</em>
                    </h1>
                    <p>
                        Discover considered pieces, private collections and
                        an experience designed around you.
                    </p>
                </div>
            </div>

            <div className="auth-panel">
                <button className="auth-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="auth-inner">
                    <p className="eyebrow dark">VELORA® ACCOUNT</p>
                    <h2>{login ? "Welcome back." : "Create your account."}</h2>
                    <p className="auth-subtitle">
                        {login
                            ? "Sign in to access your saved pieces, orders and personal collection."
                            : "Join VELORA® and choose how you want to use the platform."}
                    </p>

                    {!login && (
                        <>
                            <div className="role-label">I AM JOINING AS</div>

                            <div className="role-switch">
                                <button
                                    type="button"
                                    className={role === "buyer" ? "active" : ""}
                                    onClick={() => setRole("buyer")}
                                >
                                    <span>BUYER</span>
                                    <small>Shop & collect</small>
                                </button>

                                <button
                                    type="button"
                                    className={role === "seller" ? "active" : ""}
                                    onClick={() => setRole("seller")}
                                >
                                    <span>SELLER</span>
                                    <small>List & manage jewellery</small>
                                </button>
                            </div>
                        </>
                    )}

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={submit}>
                        {!login && (
                            <>
                                <label>
                                    USERNAME
                                    <input
                                        required
                                        value={form.username}
                                        onChange={(e) => change("username", e.target.value)}
                                        placeholder="Choose a username"
                                    />
                                </label>

                                <label>
                                    EMAIL ADDRESS
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => change("email", e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </label>
                            </>
                        )}

                        {login && (
                            <label>
                                USERNAME
                                <input
                                    required
                                    value={form.username}
                                    onChange={(e) => change("username", e.target.value)}
                                    placeholder="Your username"
                                />
                            </label>
                        )}

                        <label>
                            PASSWORD
                            <input
                                required
                                type="password"
                                value={form.password}
                                onChange={(e) => change("password", e.target.value)}
                                placeholder="••••••••"
                            />
                        </label>

                        {!login && (
                            <label>
                                CONFIRM PASSWORD
                                <input
                                    required
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) => change("confirmPassword", e.target.value)}
                                    placeholder="••••••••"
                                />
                            </label>
                        )}

                        {login && (
                            <div className="auth-options">
                                <span>SESSION AUTHENTICATION</span>
                                <span>PASSPORT LOCAL</span>
                            </div>
                        )}

                        <button className="auth-submit" disabled={submitting}>
                            {submitting
                                ? "PLEASE WAIT..."
                                : login
                                    ? "SIGN IN"
                                    : `CREATE ${role.toUpperCase()} ACCOUNT`}
                            {!submitting && <ArrowRight size={15} />}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <button
                        className="google-btn"
                        type="button"
                        onClick={() =>
                            setError("Google authentication is not configured in the current backend.")
                        }
                    >
                        <b>G</b> CONTINUE WITH GOOGLE
                    </button>

                    <p className="auth-switch">
                        {login
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <button
                            onClick={() => onSwitch(login ? "signup" : "login")}
                        >
                            {login ? "Create one" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

function QuickLook({
    product,
    liked,
    onLike,
    onClose,
    onAdd
}) {

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewError, setReviewError] = useState("");

    const reviews = product.reviews || [];


   const submitReview = async () => {

    try {

        setReviewError("");

        if (!comment.trim()) {

            setReviewError(
                "Please write a review."
            );

            return;

        }

        await reviewApi.create(
            product._id,
            {
                rating,
                comment
            }
        );

        setComment("");

        window.location.reload();

    } catch (error) {

        console.error(
            "REVIEW ERROR:",
            error
        );

        setReviewError(
            error.message
        );

    }

};

return(
    <div
    className="modal-backdrop"
    onClick={(e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }}
>
    <div className="quick-modal">
        <button
            type="button"
            className="quick-close"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            aria-label="Close"
        >
            <X size={20} />
        </button>

                {/* IMAGE */}

                <div className="quick-image">

                    <img
    src={
        getImageUrl(product.img) ||
        "/jewellery-necklace.png"
    }
    alt={product.name}
/>

                </div>


                {/* PRODUCT DETAILS */}

                <div className="quick-content">

                    <button
                        className={`quick-heart ${
                            liked ? "liked" : ""
                        }`}
                        onClick={onLike}
                    >
                        <Heart
                            size={18}
                            fill={
                                liked
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>


                    <p className="eyebrow dark">
                        FINE JEWELLERY
                    </p>


                    <h2>
                        {product.name}
                    </h2>


                    <strong className="quick-price">
                        {money(product.price)}
                    </strong>


                    <p>
                        {product.desc}
                    </p>


                    <div className="detail-row">
                        <span>MATERIAL</span>
                        <b>18K GOLD</b>
                    </div>


                    <div className="detail-row">
                        <span>FINISH</span>
                        <b>HIGH POLISH</b>
                    </div>


                    <div className="detail-row">
                        <span>CRAFT</span>
                        <b>HAND FINISHED</b>
                    </div>


                    <button
                        className="add-large"
                        onClick={onAdd}
                    >
                        ADD TO BAG
                        <ShoppingBag size={16} />
                    </button>


                    {/* ========================= */}
                    {/* REVIEWS */}
                    {/* ========================= */}

                    <div className="review-box">

                        <div className="review-title">

                            <span>
                                REVIEWS
                            </span>

                            <span>
                                {reviews.length}{" "}
                                REVIEW
                                {reviews.length === 1
                                    ? ""
                                    : "S"}
                            </span>

                        </div>


                        {/* EXISTING REVIEWS */}

                        <div className="reviews-list">

                            {reviews.length === 0 ? (

                                <p className="no-reviews">
                                    No reviews yet.
                                    Be the first to
                                    review this piece.
                                </p>

                            ) : (

                                reviews.map(
                                    (review, index) => (

                                        <div
                                            className="single-review"
                                            key={
                                                review._id ||
                                                index
                                            }
                                        >

                                            <div className="review-header">

                                                <div className="review-stars">

                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (

                                                            <Star
                                                                key={star}
                                                                size={13}
                                                                fill={
                                                                    star <=
                                                                    review.rating
                                                                        ? "currentColor"
                                                                        : "none"
                                                                }
                                                            />

                                                        )
                                                    )}

                                                </div>


                                                {review.createdAt && (

                                                    <small>
                                                        {new Date(
                                                            review.createdAt
                                                        ).toLocaleDateString()}
                                                    </small>

                                                )}

                                            </div>


                                            <p>
                                                {review.comment}
                                            </p>

                                        </div>

                                    )
                                )

                            )}

                        </div>


                        {/* ADD REVIEW */}

                        <div className="add-review">

                            <p className="review-label">
                                WRITE A REVIEW
                            </p>


                            <div className="stars">

                                {[1, 2, 3, 4, 5].map(
                                    (n) => (

                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() =>
                                                setRating(n)
                                            }
                                        >

                                            <Star
                                                size={14}
                                                fill={
                                                    n <= rating
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />

                                        </button>

                                    )
                                )}

                            </div>


                            <textarea
                                value={comment}
                                onChange={(e) =>
                                    setComment(
                                        e.target.value
                                    )
                                }
                                placeholder="Write your review"
                            />


                            {reviewError && (

                                <small className="review-error">
                                    {reviewError}
                                </small>

                            )}


                            <button
                                className="review-submit"
                                onClick={submitReview}
                            >
                                ADD REVIEW
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
function CartDrawer({ cart, total, onClose, onRemove }) {
    return (
        <div className="drawer-backdrop" onMouseDown={onClose}>
            <aside className="cart-drawer" onMouseDown={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <div>
                        <p className="eyebrow dark">YOUR VELORA BAG</p>
                        <h2>Cart ({cart.length})</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}><X /></button>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <Sparkles size={25} />
                        <p>Your bag is waiting.</p>
                        <small>Discover a piece to make it yours.</small>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div className="cart-item" key={item._id}>
                                    <img src={item.img || "/jewellery-necklace.png"} alt={item.name} />

                                    <div>
                                        <span>{item.name}</span>
                                        <h3>{money(item.price)}</h3>
                                        <button
                                            className="remove"
                                            onClick={() => onRemove(item._id)}
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout">
                            <div className="free-ship">
                                COMPLIMENTARY SHIPPING ON ORDERS OVER $500
                            </div>

                            <div className="total">
                                <span>SUBTOTAL</span>
                                <strong>{money(total)}</strong>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={() => alert("Connect this button to your PayU checkout flow.")}
                            >
                                CHECKOUT <ArrowRight size={16} />
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}

function SellerDashboard({
    onClose,
    showMessage
}) {

    const [products, setProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(true);


    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
    name: "",
    img: "",
    category: "",
    price: "",
    desc: ""
});
    const [busy, setBusy] = useState(false);
    useEffect(() => {

    loadMyProducts();

}, []);


const loadMyProducts = async () => {

    try {

        setLoadingProducts(true);

        const data =
            await productApi.mine();

        setProducts(
            data.products || []
        );

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

        setProducts([]);

    } finally {

        setLoadingProducts(false);

    }

};
    const reset = () => {

    setEditing(null);

    setForm({
        name: "",
        img: "",
        category: "",
        price: "",
        desc: ""
    });

};

    const startEdit = (product) => {
        setEditing(product._id);
        setForm({
    name: product.name || "",
    img: product.img || "",
    category: product.category || "",
    price: product.price || "",
    desc: product.desc || ""
});
    };

    const save = async (e) => {

    e.preventDefault();

    try {

        setBusy(true);

        if (editing) {

            await productApi.update(
                editing,
                {
                    ...form,
                    price: Number(form.price)
                }
            );

            showMessage(
                "Product updated."
            );

        } else {

            await productApi.create(
                {
                    ...form,
                    price: Number(form.price)
                }
            );

            showMessage(
                "Product created."
            );

        }

        reset();

        // Reload ONLY seller's products
        await loadMyProducts();

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    } finally {

        setBusy(false);

    }

};

    const remove = async (id) => {

    if (!confirm("Delete this product?"))
        return;

    try {

        await productApi.remove(id);

        showMessage(
            "Product deleted."
        );

        await loadMyProducts();

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

};

    return (
        <div className="seller-screen">
            <div className="seller-top">
                <div>
                    <p className="eyebrow dark">SELLER STUDIO</p>
                    <h2>Manage your <em>collection.</em></h2>
                </div>
                <button className="seller-close" onClick={onClose}><X /></button>
            </div>

            <div className="seller-layout">
                <form className="seller-form" onSubmit={save}>
                    <p className="eyebrow dark">{editing ? "EDIT PRODUCT" : "ADD PRODUCT"}</p>

                    <label>PRODUCT NAME<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                    <label>IMAGE URL<input required value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="https://..." /></label>
                    <label>CATEGORY
                        <select
                            required
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value
                                })
                            }
                        >
                            <option value="">Select category</option>
                            <option value="NECKLACES">Necklaces</option>
                            <option value="RINGS">Rings</option>
                            <option value="EARRINGS">Earrings</option>
                            <option value="BRACELETS">Bracelets</option>
                        </select>
                    </label>
                    <label>PRICE<input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
                    <label>DESCRIPTION<textarea required value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>

                    <div className="seller-form-actions">
                        <button className="auth-submit" disabled={busy}>
                            {editing ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
                            <ArrowRight size={15} />
                        </button>
                        {editing && <button type="button" className="cancel-btn" onClick={reset}>CANCEL</button>}
                    </div>
                </form>

                <div className="seller-products">
                    <div className="seller-list-head">
                        <span>YOUR PRODUCTS</span>
                        <span>{products.length} ITEMS</span>
                    </div>

                    {products.map((product) => (
                        <div className="seller-product" key={product._id}>
                            <img src={product.img || "/jewellery-necklace.png"} alt={product.name} />
                            <div>
                                <span>{product.name}</span>
                                <b>{money(product.price)}</b>
                            </div>
                            <button onClick={() => startEdit(product)}><Pencil size={15} /></button>
                            <button onClick={() => remove(product._id)}><Trash2 size={15} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CinematicFilm({ onClose }) {
    const scenes = [
        ["01", "THE COLLECTION", "A considered edit of fine jewellery.", "/jewellery-necklace.png"],
        ["02", "THE HERO", "Designed to catch the light.", "/jewellery-model.png"],
        ["03", "VELORA®", "Fine jewellery, designed to become part of your story.", "/jewellery-model.png"],
        ["04", "DISCOVERY", "Eight pieces. One unmistakable point of view.", "/jewellery-necklace.png"],
        ["05", "THE DETAILS", "Hand-finished gold. Luminous stones.", "/jewellery-model.png"],
        ["06", "THE SIGNATURE", "A silhouette made to be remembered.", "/jewellery-necklace.png"],
        ["07", "THE FINAL PIECE", "Timeless pieces. Made to be remembered.", "/jewellery-model.png"]
    ];

    const [scene, setScene] = useState(0);
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        if (!playing) return;

        const timer = setInterval(() => {
            setScene((current) => (current + 1) % scenes.length);
        }, 3800);

        return () => clearInterval(timer);
    }, [playing]);

    const current = scenes[scene];

    return (
        <div className="film-screen">
            <img src={current[3]} alt="VELORA campaign" />
            <div className="film-shade" />

            <div className="film-header">
                <span>VELORA®</span>
                <button onClick={onClose}><X size={20} /></button>
            </div>

            <div className="film-copy">
                <p>{current[0]} / 07</p>
                <span>{current[1]}</span>
                <h1>{current[2]}</h1>
            </div>

            <div className="film-bottom">
                <button onClick={() => setPlaying(!playing)}>
                    {playing ? "PAUSE FILM" : "PLAY FILM"}
                </button>

                <div className="film-timeline">
                    {scenes.map((_, index) => (
                        <button
                            key={index}
                            className={index === scene ? "active" : ""}
                            onClick={() => setScene(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MobileMenu({
    user,
    onClose,
    onLogin,
    onSignup,
    onLogout,
    onSeller,
    onFilm,
    onCategory
}) {
    return (
        <div className="mobile-panel">
            <button className="mobile-close" onClick={onClose}><X /></button>

            <span className="mobile-kicker">VELORA®</span>

            {user && (
                <div className="mobile-user">
                    <UserRound size={16} />
                    {user.username} · {user.role.toUpperCase()}
                </div>
            )}

            <button onClick={onFilm}>THE FILM</button>
            {CATEGORIES.map((item) => (
                <button key={item} onClick={() => onCategory(item)}>
                    {item}
                </button>
            ))}

            {user?.role === "seller" && (
                <button onClick={onSeller}>SELLER STUDIO</button>
            )}

            {!user ? (
                <>
                    <button onClick={onLogin}>LOGIN</button>
                    <button onClick={onSignup}>SIGN UP</button>
                </>
            ) : (
                <button onClick={onLogout}>LOGOUT</button>
            )}
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);
