import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaYoutube } from 'react-icons/fa';

const VideoManager = ({ token, BASE_URL }) => {
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState({ title: '', youtubeUrl: '', category: 'MediaPage' });

    useEffect(() => { fetchVideos(); }, []);

    const fetchVideos = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/Videos`);
            const filtered = (res.data || []).filter(v => v.category === 'MediaPage');
            setVideos(filtered);
        } catch { setVideos([]); }
    };

    const handleAddVideo = async () => {
        if (!newVideo.youtubeUrl || !newVideo.title) return alert("Hata!");
        try {
            await axios.post(`${BASE_URL}/api/Videos`, { ...newVideo, category: 'MediaPage' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewVideo({ title: '', youtubeUrl: '', category: 'MediaPage' });
            fetchVideos();
        } catch { alert("Ekleme başarısız."); }
    };

    const deleteVideo = async (id) => {
        if (!window.confirm("Silinsin mi?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/Videos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setVideos(prev => prev.filter(v => v.id !== id));
        } catch { alert("Hata!"); }
    };

    return (
        <div className="p-3 text-start text-dark">
            <div className="bg-light p-3 rounded-4 shadow-sm mb-4 border">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaYoutube className="text-primary" /> Medya Videosu Ekle</h6>
                <input type="text" className="form-control mb-2" placeholder="Başlık" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
                <input type="text" className="form-control mb-2" placeholder="YouTube URL" value={newVideo.youtubeUrl} onChange={e => setNewVideo({...newVideo, youtubeUrl: e.target.value})} />
                <button onClick={handleAddVideo} className="btn btn-primary w-100 fw-bold border-0" style={{ backgroundColor: '#aec90b' }}>MEDYA LİSTESİNE EKLE</button>
            </div>
            <div className="video-list overflow-auto border rounded bg-white shadow-sm" style={{ maxHeight: '300px' }}>
                {videos.map(v => (
                    <div key={v.id} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <small className="fw-bold">{v.title}</small>
                        <button onClick={() => deleteVideo(v.id)} className="btn btn-outline-danger btn-sm border-0"><FaTrash /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default VideoManager;