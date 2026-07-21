import { useEffect, useState } from "react";
import { useProgressStore } from "../../store/progressStore";
import "./CrawlerProgress.css";
import { ChevronDown, ChevronUp } from "lucide-react";

const CrawlerProgress = ({ job }) => {

    // console.log("CrawlerProgress rendered, job=", job);

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [visible, setVisible] = useState(true);

    const [isClosing, setIsClosing] = useState(false);

    const [minimized, setMinimized] = useState(false);

    const { finishJob } = useProgressStore();

    useEffect(() => {
        let isActive = true;
        const ws = new WebSocket(
            `ws://127.0.0.1:8000/api/v1/ws/progress/${job.companyId}`
        );

        ws.onmessage = (event) => {
            if (!isActive) return; // ignore messages if this effect instance was cleaned up
            const data = JSON.parse(event.data);
            setProgress(data.progress);
            setStatus(data.status);

            // if (data.progress === 100) {
            //     setTimeout(() => {
            //         setVisible(false);
            //         finishJob();
            //     }, 3000);
            // }
            if (data.progress === 100) {
                setTimeout(() => {
                    setIsClosing(true);

                    setTimeout(() => {
                        setVisible(false);
                        finishJob();
                    }, 450); // match CSS animation duration
                }, 3000);
            }
            if (data.progress === -1) {
                setStatus("Something went wrong");
            }
        };


        return () => {
            isActive = false;
            // Only close if it's open or still connecting — avoids errors on already-closed sockets
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [job.companyId, finishJob]);

    if (!visible) return null;

    return (
        <div className={`progress-overlay ${minimized ? "minimized" : ""} ${isClosing ? "closing" : ""}`}>
            {/* Wrap everything in a content layer container */}
            <div className="progress-content">
                <button
                    onClick={() => setMinimized(!minimized)}
                    title={status}
                    className="progress-toggle"
                >
                    {minimized ? (
                        <ChevronUp size={16} strokeWidth={2.2} />
                    ) : (
                        <ChevronDown size={16} strokeWidth={2.2} />
                    )}
                </button>

                {minimized && (
                    <span className="mini-percent">{progress}%</span>
                )}

                {!minimized && (
                    <>
                        <h4>VoxIntel AI Setup</h4>
                        <p>{status}</p>

                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <span>{progress}%</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default CrawlerProgress;