import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, ChevronRight, Heart, ImagePlus, Send, Trash2, X } from 'lucide-react';
import Scene from './Scene'
// 后端API全部注释，消除类型导入报错
// import { asset, Message, messagesApi, Photo, photosApi, removePhoto } from './api';
// 导入组件
import CircularGallery from './CircularGallery/CircularGallery';
// 导入组件样式
import './CircularGallery/CircularGallery.css';
//import Lanyard from './Lanyard/Lanyard';
import Masonry from './Masonry/Masonry';
import PixelTransition from './PixelTransition/PixelTransition';
import p1 from './images/p1.jpg'
import p2 from './images/p2.jpg'
import p3 from './images/p3.jpg'
import p4 from './images/p4.jpg'
import p5 from './images/p5.jpg'
import p6 from './images/p6.jpg'
import p7 from './images/p7.jpg'
import p8 from './images/p8.jpg'
import mypic from './images/mypic.jpg'
// 动画通用配置
const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .18 },
  transition: { duration: .7, ease: 'easeOut' as const }
};

// 相恋纪念日
const anniversary = new Date('2026-03-05T00:00:00');

// 实时计时器Hook
function useSeconds() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

// 计算距离目标日期天数
function daysUntil(targetDate: Date) {
  return Math.ceil((targetDate.getTime() - Date.now()) / 86400000);
}

// ========== 卷轴轮播静态写死数组（替代后端galleryItems） ==========
const galleryRollItems = [
  {
    id: "r1",
    image: "/uploads/r1.jpg",
    text: "去做美甲"
  },
  {
    id: "r2",
    image:"/uploads/r2.jpg",
    text: "汉堡王"
  },
  {
    id: "r3",
    image:"/uploads/r3.jpg",
    text: "武汉"
  },
  {
    id: "r4",
    image: "/uploads/r4.jpg",
    text: "青梅竹马"
  },
  {
    id: "r5",
    image: "/uploads/r5.jpg",
    text: "起飞"
  },
  {
    id: "r6",
    image: "/uploads/r6.jpg",
    text: "阿猜"
  },
];

// ===================== 瀑布流静态图片数组 =====================
const photoItems = [
  {
    id: "1",
    img: p1,
    url: "",
    height: 520,
  },
  {
    id: "2",
    img: p2,
    url: "",
    height: 380,
  },
  {
    id: "3",
    img: p3,
    url: "",
    height: 680,
  },
  {
    id: "4",
    img: p4,
    url: "",
    height: 420,
  },
  {
    id: "5",
    img: p5,
    url: "",
    height: 500,
  },
  {
    id: "6",
    img: p6,
    url: "",
    height: 360,
  },
  {
    id: "7",
    img: p7,
    url: "",
    height: 700,
  },
{
    id: "8",
    img: p8,
    url: "",
    height: 400,
  },
];

// 可拖拽照片组件（依赖后端Photo类型，整个注释屏蔽TS报错）
/*
function SortPhoto({ photo, onOpen, onDelete }: { photo: Photo; onOpen: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id });

  return (
    <motion.article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="photo-card glow-card"
      layout
      {...attributes}
    >
      <button className="drag" {...listeners} aria-label="拖拽排序">⋮⋮</button>
      <img loading="lazy" src={asset(photo.url)} onClick={onOpen} />
      <button className="icon delete" onClick={onDelete}>
        <Trash2 size={15} />
      </button>
    </motion.article>
  );
}
*/

// ===================== 照片图库模块 =====================
function Gallery() {
  // 后端相关状态全部注释
  // const [photos, setPhotos] = useState<Photo[]>([]);
  // const [preview, setPreview] = useState<number | null>(null);
  // const [page, setPage] = useState(0);
  // const [busy, setBusy] = useState(false);
  // const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  // const perPage = 6;
  // const visiblePhotos = photos.slice(page * perPage, page * perPage + perPage);

  // 上传、删除接口函数注释
  /*
  const handleUpload = async () => {
    if (!selectedFile) return alert("请选择图片");
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("text", uploadText.trim() || "美好瞬间");

    try {
      const res = await fetch("http://localhost:8000/api/photos", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (res.ok) {
        await fetchPhotos();
        setUploadOpen(false);
        setSelectedFile(null);
        setUploadText("");
        alert("上传成功！页面已刷新照片");
      } else {
        alert(result.detail || "上传失败");
      }
    } catch (err) {
      console.error("上传错误：", err);
      alert("无法连接后端服务");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.includes('.')) {
      try { await removePhoto(id); } catch {}
    }
    setPhotos(prev => prev.filter(item => item.id !== id));
    setPreview(null);
  };
  */

  return (
    <>
      {/* 瀑布流标题 */}
      <div className="section-head">
        <span>02 / PHOTO ARCHIVE</span>
        <h2>每一帧，都在发光</h2>
      </div>

      {/* 仅保留静态Masonry瀑布流，无后端依赖 */}
      <div style={{ minHeight: 450, padding: '2rem 1rem', marginBottom: "6rem" }}>
        <Masonry
          items={photoItems}
          ease="bounce.out"
          duration={0.6}
          stagger={0.06}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover={true}
        />
      </div>

      {/* 拖拽、分页、预览全部注释，消除TS报错 */}
      {/*
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            setPhotos(prev => arrayMove(
              prev,
              prev.findIndex(p => p.id === active.id),
              prev.findIndex(p => p.id === over.id)
            ));
          }
        }}
      >
        <SortableContext
          items={visiblePhotos.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {visiblePhotos.length ? (
            visiblePhotos.map((photo, idx) => (
              <SortPhoto
                key={photo.id}
                photo={photo}
                onOpen={() => setPreview(page * perPage + idx)}
                onDelete={() => handleDelete(photo.id)}
              />
            ))
          ) : (
            <div className="empty">🐍把照片放进这里吧🐘<br/><small>jpg / png / webp</small></div>
          )}
        </SortableContext>
      </DndContext>

      {photos.length > perPage && (
        <div className="pager">
          <button onClick={() => setPage(Math.max(0, page - 1))}>
            <ChevronLeft />
          </button>
          <span>{page + 1} / {Math.ceil(photos.length / perPage)}</span>
          <button onClick={() => setPage(Math.min(Math.ceil(photos.length / perPage) - 1, page + 1))}>
            <ChevronRight />
          </button>
        </div>
      )}

      <AnimatePresence>
        {preview !== null && photos[preview] && (
          <Preview
            photo={photos[preview]}
            onClose={() => setPreview(null)}
            onNext={(step) => setPreview((preview + step + photos.length) % photos.length)}
          />
        )}
      </AnimatePresence>
      */}
    </>
  );
}

// 大图预览组件（依赖后端Photo/asset，注释屏蔽）
/*
function Preview({ photo, onClose, onNext }: {
  photo: { url?: string; img?: string; id: string; } | Photo;
  onClose: () => void;
  onNext: (step: number) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgSrc = photo.img || asset(photo.url!);

  return (
    <motion.div
      className="modal-shade"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="preview"
        drag
        dragMomentum={false}
        style={{ x, y }}
        initial={{ scale: .85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: .85, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imgSrc} alt="回忆大图" />
        <button className="icon close" onClick={onClose}>
          <X />
        </button>
        <button className="nav prev" onClick={() => onNext(-1)}>
          <ChevronLeft />
        </button>
        <button className="nav next" onClick={() => onNext(1)}>
          <ChevronRight />
        </button>
      </motion.div>
    </motion.div>
  );
}
*/

// 留言模块（依赖后端接口，整体注释，避免打包报错）
/*
function Messages() {
  const [items, setItems] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [shownCount, setShownCount] = useState(5);

  useEffect(() => {
    messagesApi.list()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    const tempText = text;
    setText('');
    try {
      const newMsg = await messagesApi.add(tempText);
      setItems(prev => [newMsg, ...prev]);
    } catch {
      setText(tempText);
    }
  };

  const handleDelete = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    try { await messagesApi.remove(id); } catch {}
  };

  return (
    <motion.section className="section" {...reveal}>
      <div className="section-head">
        <span>03 / LOVE NOTES</span>
        <h2>『 留言🌷留言 』</h2>
      </div>

      <div className="message-box glass">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="爱你，请留言"
        />
        <button onClick={handleSend}>
          <Send size={17} />
          送达星河
        </button>
      </div>

      <div className="notes">
        {!loading && items.slice(0, shownCount).map((msg) => (
          <motion.article
            key={msg.id}
            className="note glass glow-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{msg.content}</p>
            <time>{new Date(msg.createdAt).toLocaleString('zh-CN')}</time>
            <button className="icon delete" onClick={() => handleDelete(msg.id)}>
              <Trash2 size={14} />
            </button>
          </motion.article>
        ))}
        {!loading && !items.length && (
          <div className="empty">还没有留言。第一句心事，留给你。</div>
        )}
      </div>

      {items.length > shownCount && (
        <button className="more" onClick={() => setShownCount(prev => prev + 5)}>
          加载更多旧时光
        </button>
      )}
    </motion.section>
  );
}
*/

// 根页面组件
function App() {
  const now = useSeconds();
  const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null);
  const [secret, setSecret] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  // 后端照片状态注释
  // const [photos, setPhotos] = useState<{ url: string }[]>([]);
  const togetherDays = Math.floor((now - anniversary.getTime()) / 86400000);
  const nextAnniDays = daysUntil(new Date('2026-08-19'));

  // 上传相关状态全部保留（你要求保留上传按钮弹窗）
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadText, setUploadText] = useState("");

  // 后端生成轮播数组注释，改用全局静态 galleryRollItems
  /*
  const galleryItems = useMemo(() => {
    if (!Array.isArray(photos)) return [];
    return photos
      .filter(item => !!item && item.id)
      .map(p => ({
        id: p?.id,
        image: `http://localhost:8000/uploads/${p?.url ?? ""}`,
        text: p?.text || "我们的回忆"
      }));
  }, [photos]);
  */

  // 后端拉取图片接口注释
  /*
  const fetchPhotos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/photos");
      const raw = await res.json();
      const rawList = Array.isArray(raw) ? raw : [];
      const validList = rawList.filter(item => item?.id && item?.url);
      setPhotos(validList);
    } catch (err) {
      console.error("加载图片失败", err);
      setPhotos([]);
    }
  };
  */

  // 文件选择函数保留
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 上传接口函数保留（前端按钮弹窗正常显示，只是后端不存在会请求失败，不影响页面渲染）
  const handleUpload = async () => {
    if (!selectedFile) return alert("请选择图片");
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("text", uploadText.trim() || "美好瞬间");

    try {
      const res = await fetch("http://localhost:8000/api/photos", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (res.ok) {
        // await fetchPhotos();
        setUploadOpen(false);
        setSelectedFile(null);
        setUploadText("");
        alert("上传成功！页面已刷新照片");
      } else {
        alert(result.detail || "上传失败");
      }
    } catch (err) {
      console.error("上传错误：", err);
      alert("无法连接后端服务");
    } finally {
      setUploadLoading(false);
    }
  };

  // 页面初始化拉取图片effect注释
  /*
  useEffect(() => {
    fetchPhotos();
  }, []);
  */

  // 鼠标、双击彩蛋逻辑保留无影响
  useEffect(() => {
    let clickCount = 0;
    let throttleTimer: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimer) return;
      throttleTimer = window.setTimeout(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
        throttleTimer = null;
      }, 16);
    };

    const handleClick = (e: MouseEvent) => {
      clickCount++;
      setBurst({ x: e.clientX, y: e.clientY, id: Date.now() });
      setTimeout(() => clickCount = 0, 400);
      if (clickCount === 2) {
        setSecret(true);
        clickCount = 0;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSecret(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('contextmenu', handleContextMenu);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  return (
    <>
      {/* 3D粒子背景 */}
      <Scene style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none"
      }} />

      {/* 自定义爱心光标 */}
      <div ref={cursorRef} className="cursor-heart">♥</div>

      <main>
        {/* 首页英雄区 */}
        <section className="hero">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
            <div>
              <p className="eyebrow">OUR LITTLE UNIVERSE · SINCE 2025.03.05</p>
              <motion.h1
                style={{ marginTop: "0px" }}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2 }}
              >
                蛇蛇 and 鼠鼠<br />
                <em>的记忆</em>
              </motion.h1>
              <p className="intro">在无数个普通的瞬间里，偏偏和你，拥有了宇宙级的浪漫。</p>
            </div>

            {/* 右上角像素卡片 */}
            <PixelTransition
              firstContent={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display:"grid",
                    placeItems: "center",
                    backgroundColor: "#111"
                  }}
                >
                  <p style={{ fontWeight: 900, fontSize: "4rem", color: "#fff" }}>🐖</p>
                </div>
              }
              secondContent={
                <img
                  src={mypic}
                  alt="bbb"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              }
              gridSize={8}
              pixelColor="#fff"
              once={false}
              animationStepDuration={0.4}
              className="custom-pixel-card"
              style={{ width: "300px", height: "300px", flexShrink: 0 }}
            />
          </div>

          <div className="stats">
            <div className="glass">
              <b>{togetherDays}</b>
              <span>个一起醒来的日子</span>
            </div>
            <div className="glass">
              <b>{nextAnniDays}</b>
              <span>天后又一个纪念日</span>
            </div>
          </div>

          <a href="#story" className="scroll">向下收集回忆 ↓</a>
        </section>

        <div style={{ marginTop: "-300px" }}>
          {/* 上传按钮完整保留，不注释 */}
          {!uploadOpen && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                onClick={() => setUploadOpen(true)}
                style={{
                  padding: "10px 26px",
                  background: "#ff77aa",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "15px",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 99999
                }}
              >
                🐍把照片放进这里吧🐘
              </button>
            </div>
          )}

          {/* 卷轴轮播完整保留，items替换为静态写死数组 galleryRollItems */}
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery
              bend={0.3}
              textColor="#ffffff"
              borderRadius={0.18}
              scrollEase={0.05}
              fontUrl="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap"
              font="30px ZCOOL KuaiLe"
              scrollSpeed={2}
              items={galleryRollItems}
            />
          </div>
        </div>

        {/* 时间线故事板块 */}
        <motion.section id="story" className="section timeline" {...reveal}>
          <div className="section-head">
            <span>01 / OUR CHAPTERS</span>
            <h2>把相遇，留在时间里</h2>
          </div>
          {[
            ['第一次见面', '那天的风很温柔，而你刚好出现。'],
            ['第一次一起吃饭', '烟火气里全是喜欢你。'],
            ['往后岁岁年年', '所有风景，都想和你一起看。']
          ].map(([title, desc], index) => (
            <motion.article
              className="story glass glow-card"
              key={title}
              initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <i>0{index + 1}</i>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <Heart fill="currentColor" />
            </motion.article>
          ))}
        </motion.section>

        {/* 瀑布流图库保留 */}
        <Gallery />

        {/* 留言板整体注释，无后端接口会报错 */}
        {/* <Messages /> */}
      </main>

      {/* 上传弹窗完整保留 */}
      {uploadOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 100000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "#12121a",
            padding: "32px",
            borderRadius: "20px",
            width: "440px",
            color: "#fff",
            boxShadow: "0 0 40px rgba(255,119,170,0.2)"
          }}>
            <h3 style={{ margin: 0, marginBottom: "16px" }}>上传新回忆照片</h3>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ margin: "10px 0 16px" }}
            />
            <input
              type="text"
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
              placeholder="输入这张照片的专属文字"
              style={{
                width: "100%",
                padding: "12px",
                background: "#1e1e2e",
                border: "1px solid #444",
                color: "#fff",
                borderRadius: "8px",
                boxSizing: "border-box"
              }}
            />
            {selectedFile && (
              <p style={{ margin: "12px 0 0", color: "#ffb8d2", fontSize: "14px" }}>
                已选：{selectedFile.name}
              </p>
            )}
            <div style={{ display: "flex", gap: "14px", marginTop: "28px" }}>
              <button
                onClick={() => {
                  setUploadOpen(false);
                  setSelectedFile(null);
                  setUploadText("");
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px"
                }}
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadLoading || !selectedFile}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#ff77aa",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px"
                }}
              >
                {uploadLoading ? "上传中..." : "确认上传"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer>
        Made with <Heart size={14} fill="currentColor" /> for our forever <span>✦</span>
      </footer>

      {/* 点击爱心爆炸动画 */}
      <AnimatePresence>
        {burst && (
          <motion.div
            key={burst.id}
            className="burst"
            style={{ left: burst.x, top: burst.y }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <motion.i
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: .4 }}
                animate={{
                  x: Math.cos(i / 12 * Math.PI * 2) * 90,
                  y: Math.sin(i / 12 * Math.PI * 2) * 90,
                  opacity: 0,
                  scale: 1.2
                }}
                transition={{ duration: .7 }}
              >
                ♥
              </motion.i>
            ))}
          </motion.div>
        )}

        {/* 双击/右键彩蛋弹窗 */}
        {secret && (
          <motion.div
            className="secret"
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .8 }}
            onClick={() => setSecret(false)}
          >
            <div className="glass" onClick={(e) => e.stopPropagation()}>
              <button className="icon close" onClick={() => setSecret(false)}>
                <X />
              </button>
              <Heart fill="currentColor" />
              <h2>彩蛋</h2>
              <p>佘雨凡是傻子</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;