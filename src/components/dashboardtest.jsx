import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
    const { slug, accessToken, logout } = useAuthStore();

    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1>Dashboard</h1>

            <div
                style={{
                    marginTop: "20px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                }}
            >
                <p>
                    <strong>Status:</strong> Logged In ✅
                </p>

                <p>
                    <strong>Company Slug:</strong> {slug}
                </p>

                <p>
                    <strong>Access Token:</strong>
                </p>

                <textarea
                    value={accessToken || ""}
                    readOnly
                    rows={6}
                    style={{
                        width: "100%",
                        marginTop: "10px",
                    }}
                />

                <button
                    onClick={logout}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;