import { useEffect, useState } from "react";
import { useProgressStore } from "../../store/progressStore";
import "./CrawlerProgress.css";

const CrawlerProgress = ({ job }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [visible, setVisible] = useState(true);
    const [minimized, setMinimized] = useState(false);

    const { finishJob } = useProgressStore();

    useEffect(() => {
        const ws = new WebSocket(
            `ws://127.0.0.1:8000/api/v1/ws/progress/${job.companyId}`
        );

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setProgress(data.progress);
            setStatus(data.status);

            if (data.progress === 100) {
                setTimeout(() => {
                    setVisible(false);
                    finishJob();
                }, 3000);
            }

            if (data.progress === -1) {
                setStatus("Something went wrong");
            }
        };

        return () => ws.close();
    }, [job, finishJob]);

    if (!visible) return null;

    return (
        <div className={`progress-overlay ${minimized ? "minimized" : ""}`}>
            <button onClick={() => setMinimized(!minimized)}>
                {minimized ? "⬆" : "⬇"}
            </button>

            {!minimized && (
                <>
                    <h4>VoxIntel AI Setup</h4>
                    <p>{status}</p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <span>{progress}%</span>
                </>
            )}
        </div>
    );
};

export default CrawlerProgress;