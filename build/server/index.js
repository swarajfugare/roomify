import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useNavigate, useOutletContext, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import puter from "@heyputer/puter.js";
import { ArrowRight, ArrowUpRight, BarChart3, Box, Check, CheckCircle, CheckCircle2, Clock, Code2, Download, Gauge, Heart, ImageIcon, Layers, Lightbulb, Lock, Mail, MailOpen, MapPin, MessageCircle, Phone, RefreshCcw, Send, Share2, Shield, UploadIcon, Users, X, Zap } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region lib/utils.ts
var HOSTING_CONFIG_KEY = "roomify_hosting_config";
var HOSTING_DOMAIN_SUFFIX = ".puter.site";
var isHostedUrl = (value) => typeof value === "string" && value.includes(".puter.site");
var createHostingSlug = () => `roomify-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
var normalizeHost = (subdomain) => subdomain.endsWith(".puter.site") ? subdomain : `${subdomain}${HOSTING_DOMAIN_SUFFIX}`;
var getHostedUrl = (hosting, filePath) => {
	if (!hosting?.subdomain) return null;
	return `https://${normalizeHost(hosting.subdomain)}/${filePath}`;
};
var getImageExtension = (contentType, url) => {
	const typeMatch = (contentType || "").toLowerCase().match(/image\/(png|jpe?g|webp|gif|svg\+xml|svg)/);
	if (typeMatch?.[1]) {
		const ext = typeMatch[1].toLowerCase();
		return ext === "jpeg" || ext === "jpg" ? "jpg" : ext === "svg+xml" ? "svg" : ext;
	}
	const dataMatch = url.match(/^data:image\/([a-z0-9+.-]+);/i);
	if (dataMatch?.[1]) {
		const ext = dataMatch[1].toLowerCase();
		return ext === "jpeg" ? "jpg" : ext;
	}
	const extMatch = url.match(/\.([a-z0-9]+)(?:$|[?#])/i);
	if (extMatch?.[1]) return extMatch[1].toLowerCase();
	return "png";
};
var dataUrlToBlob = (dataUrl) => {
	try {
		const match = dataUrl.match(/^data:([^;]+)?(;base64)?,([\s\S]*)$/i);
		if (!match) return null;
		const contentType = match[1] || "";
		const isBase64 = !!match[2];
		const data = match[3] || "";
		const raw = isBase64 ? atob(data.replace(/\s/g, "")) : decodeURIComponent(data);
		const bytes = new Uint8Array(raw.length);
		for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
		return {
			blob: new Blob([bytes], { type: contentType }),
			contentType
		};
	} catch {
		return null;
	}
};
var fetchBlobFromUrl = async (url) => {
	if (url.startsWith("data:")) return dataUrlToBlob(url);
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Failed to fetch image");
		return {
			blob: await response.blob(),
			contentType: response.headers.get("content-type") || ""
		};
	} catch {
		return null;
	}
};
var imageUrlToPngBlob = async (url) => {
	if (typeof window === "undefined") return null;
	try {
		const img = new Image();
		img.crossOrigin = "anonymous";
		const loaded = await new Promise((resolve, reject) => {
			img.onload = () => resolve(img);
			img.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load image"));
			img.src = url;
		});
		const width = loaded.naturalWidth || loaded.width;
		const height = loaded.naturalHeight || loaded.height;
		if (!width || !height) return null;
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(loaded, 0, 0, width, height);
		return await new Promise((resolve) => {
			canvas.toBlob((result) => resolve(result), "image/png");
		});
	} catch {
		return null;
	}
};
//#endregion
//#region lib/puter.hosting.ts
var getOrCreateHostingConfig = async () => {
	const existing = await puter.kv.get(HOSTING_CONFIG_KEY);
	if (existing?.subdomain) return { subdomain: existing.subdomain };
	const subdomain = createHostingSlug();
	try {
		const record = { subdomain: (await puter.hosting.create(subdomain, ".")).subdomain };
		await puter.kv.set(HOSTING_CONFIG_KEY, record);
		return record;
	} catch (e) {
		console.warn(`Could not find subdomain: ${e}`);
		return null;
	}
};
var uploadImageToHosting = async ({ hosting, url, projectId, label }) => {
	if (!hosting || !url) return null;
	if (isHostedUrl(url)) return { url };
	try {
		const resolved = label === "rendered" ? await imageUrlToPngBlob(url).then((blob) => blob ? {
			blob,
			contentType: "image/png"
		} : null) : await fetchBlobFromUrl(url);
		if (!resolved) return null;
		const contentType = resolved.contentType || resolved.blob.type || "";
		const ext = getImageExtension(contentType, url);
		const dir = `projects/${projectId}`;
		const filePath = `${dir}/${label}.${ext}`;
		const uploadFile = new File([resolved.blob], `${label}.${ext}`, { type: contentType });
		await puter.fs.mkdir(dir, { createMissingParents: true });
		await puter.fs.write(filePath, uploadFile);
		const hostedUrl = getHostedUrl({ subdomain: hosting.subdomain }, filePath);
		return hostedUrl ? { url: hostedUrl } : null;
	} catch (e) {
		console.warn(`Failed to store hosted image: ${e}`);
		return null;
	}
};
//#endregion
//#region lib/constants.ts
var PUTER_WORKER_URL = "https://elegant-tree-2347.puter.work";
var ROOMIFY_RENDER_PROMPT = `
TASK: Convert the input 2D floor plan into a **photorealistic, top‑down 3D architectural render**.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
3) **TOP‑DOWN ONLY**: Orthographic top‑down view. No perspective tilt.
4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/hand‑drawn look.
5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

STRUCTURE & DETAILS:
- **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
- **Doors**: Convert door swing arcs into open doors, aligned to the plan.
- **Windows**: Convert thin perimeter lines into realistic glass windows.

FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
- Bed icon → realistic bed with duvet and pillows.
- Sofa icon → modern sectional or sofa.
- Dining table icon → table with chairs.
- Kitchen icon → counters with sink and stove.
- Bathroom icon → toilet, sink, and tub/shower.
- Office/study icon → desk, chair, and minimal shelving.
- Porch/patio/balcony icon → outdoor seating or simple furniture (keep minimal).
- Utility/laundry icon → washer/dryer and minimal cabinetry.

STYLE & LIGHTING:
- Lighting: bright, neutral daylight. High clarity and balanced contrast.
- Materials: realistic wood/tile floors, clean walls, subtle shadows.
- Finish: professional architectural visualization; no text, no watermarks, no logos.
`.trim();
//#endregion
//#region lib/puter.action.ts
var signIn = async () => await puter.auth.signIn();
var signOut = () => puter.auth.signOut();
var getCurrentUser = async () => {
	try {
		return await puter.auth.getUser();
	} catch {
		return null;
	}
};
var createProject = async ({ item, visibility = "private" }) => {
	const projectId = item.id;
	const hosting = await getOrCreateHostingConfig();
	const hostedSource = projectId ? await uploadImageToHosting({
		hosting,
		url: item.sourceImage,
		projectId,
		label: "source"
	}) : null;
	const hostedRender = projectId && item.renderedImage ? await uploadImageToHosting({
		hosting,
		url: item.renderedImage,
		projectId,
		label: "rendered"
	}) : null;
	const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : "");
	if (!resolvedSource) {
		console.warn("Failed to host source image, skipping save.");
		return null;
	}
	const resolvedRender = hostedRender?.url ? hostedRender?.url : item.renderedImage && isHostedUrl(item.renderedImage) ? item.renderedImage : void 0;
	const { sourcePath: _sourcePath, renderedPath: _renderedPath, publicPath: _publicPath, ...rest } = item;
	const payload = {
		...rest,
		sourceImage: resolvedSource,
		renderedImage: resolvedRender
	};
	try {
		const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
			method: "POST",
			body: JSON.stringify({
				project: payload,
				visibility
			})
		});
		if (!response.ok) {
			console.error("failed to save the project", await response.text());
			return null;
		}
		return (await response.json())?.project ?? null;
	} catch (e) {
		console.log("Failed to save project", e);
		return null;
	}
};
var getProjects = async () => {
	try {
		const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: "GET" });
		if (!response.ok) {
			console.error("Failed to fetch history", await response.text());
			return [];
		}
		const data = await response.json();
		return Array.isArray(data?.projects) ? data?.projects : [];
	} catch (e) {
		console.error("Failed to get projects", e);
		return [];
	}
};
var getProjectById = async ({ id }) => {
	console.log("Fetching project with ID:", id);
	try {
		const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`, { method: "GET" });
		console.log("Fetch project response:", response);
		if (!response.ok) {
			console.error("Failed to fetch project:", await response.text());
			return null;
		}
		const data = await response.json();
		console.log("Fetched project data:", data);
		return data?.project ?? null;
	} catch (error) {
		console.error("Failed to fetch project:", error);
		return null;
	}
};
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var DEFAULT_AUTH_STATE = {
	isSignedIn: false,
	userName: null,
	userId: null
};
var root_default = UNSAFE_withComponentProps(function App() {
	const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE);
	const refreshAuth = async () => {
		try {
			const user = await getCurrentUser();
			setAuthState({
				isSignedIn: !!user,
				userName: user?.username || null,
				userId: user?.uuid || null
			});
			return !!user;
		} catch {
			setAuthState(DEFAULT_AUTH_STATE);
			return false;
		}
	};
	useEffect(() => {
		refreshAuth();
	}, []);
	const signIn$1 = async () => {
		await signIn();
		return await refreshAuth();
	};
	const signOut$1 = async () => {
		signOut();
		return await refreshAuth();
	};
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-background text-foreground relative z-10",
		children: /* @__PURE__ */ jsx(Outlet, { context: {
			...authState,
			refreshAuth,
			signIn: signIn$1,
			signOut: signOut$1
		} })
	});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-16 p-4 container mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", { children: message }),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
//#endregion
//#region components/ui/Button.tsx
var Button = ({ variant = "primary", size = "md", fullWidth = false, className = "", children, ...props }) => {
	return /* @__PURE__ */ jsx("button", {
		className: [
			"btn",
			`btn--${variant}`,
			`btn--${size}`,
			fullWidth ? "btn--full" : "",
			className
		].filter(Boolean).join(" "),
		...props,
		children
	});
};
//#endregion
//#region components/Navbar.tsx
var Navbar = () => {
	const { isSignedIn, userName, signIn, signOut } = useOutletContext();
	const handleAuthClick = async () => {
		if (isSignedIn) {
			try {
				await signOut();
			} catch (e) {
				console.error(`Puter sign out failed: ${e}`);
			}
			return;
		}
		try {
			await signIn();
		} catch (e) {
			console.error(`Puter sign in failed: ${e}`);
		}
	};
	return /* @__PURE__ */ jsx("header", {
		className: "navbar",
		children: /* @__PURE__ */ jsxs("nav", {
			className: "inner",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "left",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "brand",
					children: [/* @__PURE__ */ jsx(Box, { className: "logo" }), /* @__PURE__ */ jsx("span", {
						className: "name",
						children: "Roomify"
					})]
				}), /* @__PURE__ */ jsxs("ul", {
					className: "links",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "/product",
							children: "Product"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "/pricing",
							children: "Pricing"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "/community",
							children: "Community"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "/enterprise",
							children: "Enterprise"
						})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "actions",
				children: isSignedIn ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: "greeting",
					children: userName ? `Hi, ${userName}` : "Signed in"
				}), /* @__PURE__ */ jsx(Button, {
					size: "sm",
					onClick: handleAuthClick,
					className: "btn",
					children: "Log Out"
				})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
					onClick: handleAuthClick,
					size: "sm",
					variant: "ghost",
					children: "Log In"
				}), /* @__PURE__ */ jsx("a", {
					href: "#upload",
					className: "cta",
					children: "Get Started"
				})] })
			})]
		})
	});
};
//#endregion
//#region components/Footer.tsx
var Footer = () => {
	return /* @__PURE__ */ jsx("footer", {
		className: "footer",
		children: /* @__PURE__ */ jsxs("div", {
			className: "footer-inner",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "footer-content",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "footer-section footer-brand",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "brand",
								children: [/* @__PURE__ */ jsx(Box, { className: "logo" }), /* @__PURE__ */ jsx("span", {
									className: "name",
									children: "Roomify"
								})]
							}),
							/* @__PURE__ */ jsx("p", { children: "Transform architectural vision into reality with AI-powered 3D visualization." }),
							/* @__PURE__ */ jsxs("p", {
								className: "creator",
								children: ["Created by ", /* @__PURE__ */ jsx("strong", { children: "Swaraj Fugare" })]
							}),
							/* @__PURE__ */ jsx("a", {
								href: "https://portfolio.matoshreecollection.in/",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "portfolio-link",
								children: "Portfolio"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "social",
								children: [
									/* @__PURE__ */ jsx("a", {
										href: "#",
										target: "_blank",
										rel: "noopener noreferrer",
										title: "Twitter",
										children: /* @__PURE__ */ jsx(Send, { size: 16 })
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										target: "_blank",
										rel: "noopener noreferrer",
										title: "LinkedIn",
										children: /* @__PURE__ */ jsx(MessageCircle, { size: 16 })
									}),
									/* @__PURE__ */ jsx("a", {
										href: "#",
										target: "_blank",
										rel: "noopener noreferrer",
										title: "GitHub",
										children: /* @__PURE__ */ jsx(Code2, { size: 16 })
									}),
									/* @__PURE__ */ jsx("a", {
										href: "mailto:hello@roomify.com",
										title: "Email",
										children: /* @__PURE__ */ jsx(MailOpen, { size: 16 })
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "footer-section",
						children: [/* @__PURE__ */ jsx("h4", { children: "Product" }), /* @__PURE__ */ jsxs("ul", { children: [
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/product",
								children: "Features"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/pricing",
								children: "Pricing"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/community",
								children: "Community"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/enterprise",
								children: "Enterprise"
							}) })
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "footer-section",
						children: [/* @__PURE__ */ jsx("h4", { children: "Company" }), /* @__PURE__ */ jsxs("ul", { children: [
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/about",
								children: "About"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/blog",
								children: "Blog"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/careers",
								children: "Careers"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/contact",
								children: "Contact"
							}) })
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "footer-section",
						children: [/* @__PURE__ */ jsx("h4", { children: "Legal" }), /* @__PURE__ */ jsxs("ul", { children: [
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/privacy",
								children: "Privacy"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/terms",
								children: "Terms"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/security",
								children: "Security"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "/cookies",
								children: "Cookies"
							}) })
						] })]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "footer-divider",
				children: /* @__PURE__ */ jsxs("div", {
					className: "footer-bottom",
					children: [/* @__PURE__ */ jsx("p", {
						className: "copyright",
						children: "© 2024 Roomify. All rights reserved."
					}), /* @__PURE__ */ jsxs("div", {
						className: "links",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "/privacy",
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/terms",
								children: "Terms of Service"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/security",
								children: "Security"
							})
						]
					})]
				})
			})]
		})
	});
};
//#endregion
//#region components/Upload.tsx
var Upload = ({ onComplete }) => {
	const [file, setFile] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [progress, setProgress] = useState(0);
	const intervalRef = useRef(null);
	const timeoutRef = useRef(null);
	const { isSignedIn } = useOutletContext();
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);
	const processFile = useCallback((file) => {
		if (!isSignedIn) return;
		setFile(file);
		setProgress(0);
		const reader = new FileReader();
		reader.onerror = () => {
			setFile(null);
			setProgress(0);
		};
		reader.onloadend = () => {
			const base64Data = reader.result;
			intervalRef.current = setInterval(() => {
				setProgress((prev) => {
					const next = prev + 15;
					if (next >= 100) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current);
							intervalRef.current = null;
						}
						timeoutRef.current = setTimeout(() => {
							onComplete?.(base64Data);
							timeoutRef.current = null;
						}, 600);
						return 100;
					}
					return next;
				});
			}, 100);
		};
		reader.readAsDataURL(file);
	}, [isSignedIn, onComplete]);
	const handleDragOver = (e) => {
		e.preventDefault();
		if (!isSignedIn) return;
		setIsDragging(true);
	};
	const handleDragLeave = () => {
		setIsDragging(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		if (!isSignedIn) return;
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile && ["image/jpeg", "image/png"].includes(droppedFile.type)) processFile(droppedFile);
	};
	const handleChange = (e) => {
		if (!isSignedIn) return;
		const selectedFile = e.target.files?.[0];
		if (selectedFile) processFile(selectedFile);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "upload",
		children: !file ? /* @__PURE__ */ jsxs("div", {
			className: `dropzone ${isDragging ? "is-dragging" : ""}`,
			onDragOver: handleDragOver,
			onDragLeave: handleDragLeave,
			onDrop: handleDrop,
			children: [/* @__PURE__ */ jsx("input", {
				type: "file",
				className: "drop-input",
				accept: ".jpg,.jpeg,.png,.webp",
				disabled: !isSignedIn,
				onChange: handleChange
			}), /* @__PURE__ */ jsxs("div", {
				className: "drop-content",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "drop-icon",
						children: /* @__PURE__ */ jsx(UploadIcon, { size: 20 })
					}),
					/* @__PURE__ */ jsx("p", { children: isSignedIn ? "Click to upload or just drag and drop" : "Sign in or sign up with Puter to upload" }),
					/* @__PURE__ */ jsx("p", {
						className: "help",
						children: "Maximum file size 50 MB."
					})
				]
			})]
		}) : /* @__PURE__ */ jsx("div", {
			className: "upload-status",
			children: /* @__PURE__ */ jsxs("div", {
				className: "status-content",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "status-icon",
						children: progress === 100 ? /* @__PURE__ */ jsx(CheckCircle2, { className: "check" }) : /* @__PURE__ */ jsx(ImageIcon, { className: "image" })
					}),
					/* @__PURE__ */ jsx("h3", { children: file.name }),
					/* @__PURE__ */ jsxs("div", {
						className: "progress",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bar",
							style: { width: `${progress}%` }
						}), /* @__PURE__ */ jsx("p", {
							className: "status-text",
							children: progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."
						})]
					})
				]
			})
		})
	});
};
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	default: () => home_default,
	meta: () => meta$12
});
function meta$12({}) {
	return [{ title: "New React Router App" }, {
		name: "description",
		content: "Welcome to React Router!"
	}];
}
var home_default = UNSAFE_withComponentProps(function Home() {
	const navigate = useNavigate();
	const [projects, setProjects] = useState([]);
	const isCreatingProjectRef = useRef(false);
	const handleUploadComplete = async (base64Image) => {
		try {
			if (isCreatingProjectRef.current) return false;
			isCreatingProjectRef.current = true;
			const newId = Date.now().toString();
			const name = `Residence ${newId}`;
			const saved = await createProject({
				item: {
					id: newId,
					name,
					sourceImage: base64Image,
					renderedImage: void 0,
					timestamp: Date.now()
				},
				visibility: "private"
			});
			if (!saved) {
				console.error("Failed to create project");
				return false;
			}
			setProjects((prev) => [saved, ...prev]);
			navigate(`/visualizer/${newId}`, { state: {
				initialImage: saved.sourceImage,
				initialRendered: saved.renderedImage || null,
				name
			} });
			return true;
		} finally {
			isCreatingProjectRef.current = false;
		}
	};
	useEffect(() => {
		const fetchProjects = async () => {
			setProjects(await getProjects());
		};
		fetchProjects();
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "home",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("section", {
				className: "hero",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "announce",
						children: [/* @__PURE__ */ jsx("div", {
							className: "dot",
							children: /* @__PURE__ */ jsx("div", { className: "pulse" })
						}), /* @__PURE__ */ jsx("p", { children: "Introducing Roomify 2.0" })]
					}),
					/* @__PURE__ */ jsx("h1", { children: "Build beautiful spaces at the speed of thought with Roomify" }),
					/* @__PURE__ */ jsx("p", {
						className: "subtitle",
						children: "Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects faster  than ever."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "actions",
						children: [/* @__PURE__ */ jsxs("a", {
							href: "#upload",
							className: "cta",
							children: ["Start Building ", /* @__PURE__ */ jsx(ArrowRight, { className: "icon" })]
						}), /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "lg",
							className: "demo",
							children: "Watch Demo"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						id: "upload",
						className: "upload-shell",
						children: [/* @__PURE__ */ jsx("div", { className: "grid-overlay" }), /* @__PURE__ */ jsxs("div", {
							className: "upload-card",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "upload-head",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "upload-icon",
										children: /* @__PURE__ */ jsx(Layers, { className: "icon" })
									}),
									/* @__PURE__ */ jsx("h3", { children: "Upload your floor plan" }),
									/* @__PURE__ */ jsx("p", { children: "Supports JPG, PNG, formats up to 10MB" })
								]
							}), /* @__PURE__ */ jsx(Upload, { onComplete: handleUploadComplete })]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "projects",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsx("div", {
						className: "section-head",
						children: /* @__PURE__ */ jsxs("div", {
							className: "copy",
							children: [/* @__PURE__ */ jsx("h2", { children: "Projects" }), /* @__PURE__ */ jsx("p", { children: "Your latest work and shared community projects, all in one place." })]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "projects-grid",
						children: projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => /* @__PURE__ */ jsxs("div", {
							className: "project-card group",
							onClick: () => navigate(`/visualizer/${id}`),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "preview",
								children: [/* @__PURE__ */ jsx("img", {
									src: renderedImage || sourceImage,
									alt: "Project"
								}), /* @__PURE__ */ jsx("div", {
									className: "badge",
									children: /* @__PURE__ */ jsx("span", { children: "Community" })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: name }), /* @__PURE__ */ jsxs("div", {
									className: "meta",
									children: [
										/* @__PURE__ */ jsx(Clock, { size: 12 }),
										/* @__PURE__ */ jsx("span", { children: new Date(timestamp).toLocaleDateString() }),
										/* @__PURE__ */ jsx("span", { children: "By JS Mastery" })
									]
								})] }), /* @__PURE__ */ jsx("div", {
									className: "arrow",
									children: /* @__PURE__ */ jsx(ArrowUpRight, { size: 18 })
								})]
							})]
						}, id))
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region lib/ai.action.ts
var fetchAsDataUrl = async (url) => {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
	const blob = await response.blob();
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};
var generate3DView = async ({ sourceImage }) => {
	const dataUrl = sourceImage.startsWith("data:") ? sourceImage : await fetchAsDataUrl(sourceImage);
	const base64Data = dataUrl.split(",")[1];
	const mimeType = dataUrl.split(";")[0].split(":")[1];
	if (!mimeType || !base64Data) throw new Error("Invalid source image payload");
	const rawImageUrl = (await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
		provider: "gemini",
		model: "gemini-2.5-flash-image-preview",
		input_image: base64Data,
		input_image_mime_type: mimeType,
		ratio: {
			w: 1024,
			h: 1024
		}
	})).src ?? null;
	if (!rawImageUrl) return {
		renderedImage: null,
		renderedPath: void 0
	};
	return {
		renderedImage: rawImageUrl.startsWith("data:") ? rawImageUrl : await fetchAsDataUrl(rawImageUrl),
		renderedPath: void 0
	};
};
//#endregion
//#region app/routes/visualizer.$id.tsx
var visualizer_$id_exports = /* @__PURE__ */ __exportAll({ default: () => visualizer_$id_default });
var VisualizerId = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { userId } = useOutletContext();
	const hasInitialGenerated = useRef(false);
	const [project, setProject] = useState(null);
	const [isProjectLoading, setIsProjectLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentImage, setCurrentImage] = useState(null);
	const handleBack = () => navigate("/");
	const handleExport = () => {
		if (!currentImage) return;
		const link = document.createElement("a");
		link.href = currentImage;
		link.download = `roomify-${id || "design"}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const runGeneration = async (item) => {
		if (!id || !item.sourceImage) return;
		try {
			setIsProcessing(true);
			const result = await generate3DView({ sourceImage: item.sourceImage });
			if (result.renderedImage) {
				setCurrentImage(result.renderedImage);
				const saved = await createProject({
					item: {
						...item,
						renderedImage: result.renderedImage,
						renderedPath: result.renderedPath,
						timestamp: Date.now(),
						ownerId: item.ownerId ?? userId ?? null,
						isPublic: item.isPublic ?? false
					},
					visibility: "private"
				});
				if (saved) {
					setProject(saved);
					setCurrentImage(saved.renderedImage || result.renderedImage);
				}
			}
		} catch (error) {
			console.error("Generation failed: ", error);
		} finally {
			setIsProcessing(false);
		}
	};
	useEffect(() => {
		let isMounted = true;
		const loadProject = async () => {
			if (!id) {
				setIsProjectLoading(false);
				return;
			}
			setIsProjectLoading(true);
			const fetchedProject = await getProjectById({ id });
			if (!isMounted) return;
			setProject(fetchedProject);
			setCurrentImage(fetchedProject?.renderedImage || null);
			setIsProjectLoading(false);
			hasInitialGenerated.current = false;
		};
		loadProject();
		return () => {
			isMounted = false;
		};
	}, [id]);
	useEffect(() => {
		if (isProjectLoading || hasInitialGenerated.current || !project?.sourceImage) return;
		if (project.renderedImage) {
			setCurrentImage(project.renderedImage);
			hasInitialGenerated.current = true;
			return;
		}
		hasInitialGenerated.current = true;
		runGeneration(project);
	}, [project, isProjectLoading]);
	return /* @__PURE__ */ jsxs("div", {
		className: "visualizer",
		children: [/* @__PURE__ */ jsxs("nav", {
			className: "topbar",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "brand",
				children: [/* @__PURE__ */ jsx(Box, { className: "logo" }), /* @__PURE__ */ jsx("span", {
					className: "name",
					children: "Roomify"
				})]
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "sm",
				onClick: handleBack,
				className: "exit",
				children: [/* @__PURE__ */ jsx(X, { className: "icon" }), " Exit Editor"]
			})]
		}), /* @__PURE__ */ jsxs("section", {
			className: "content",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "panel",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "panel-header",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-meta",
						children: [
							/* @__PURE__ */ jsx("p", { children: "Project" }),
							/* @__PURE__ */ jsx("h2", { children: project?.name || `Residence ${id}` }),
							/* @__PURE__ */ jsx("p", {
								className: "note",
								children: "Created by You"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "panel-actions",
						children: [/* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: handleExport,
							className: "export",
							disabled: !currentImage,
							children: [/* @__PURE__ */ jsx(Download, { className: "w-4 h-4 mr-2" }), " Export"]
						}), /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: () => {},
							className: "share",
							children: [/* @__PURE__ */ jsx(Share2, { className: "w-4 h-4 mr-2" }), "Share"]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: `render-area ${isProcessing ? "is-processing" : ""}`,
					children: [currentImage ? /* @__PURE__ */ jsx("img", {
						src: currentImage,
						alt: "AI Render",
						className: "render-img"
					}) : /* @__PURE__ */ jsx("div", {
						className: "render-placeholder",
						children: project?.sourceImage && /* @__PURE__ */ jsx("img", {
							src: project?.sourceImage,
							alt: "Original",
							className: "render-fallback"
						})
					}), isProcessing && /* @__PURE__ */ jsx("div", {
						className: "render-overlay",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rendering-card",
							children: [
								/* @__PURE__ */ jsx(RefreshCcw, { className: "spinner" }),
								/* @__PURE__ */ jsx("span", {
									className: "title",
									children: "Rendering..."
								}),
								/* @__PURE__ */ jsx("span", {
									className: "subtitle",
									children: "Generating your 3D visualization"
								})
							]
						})
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "panel compare",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "panel-header",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "panel-meta",
						children: [/* @__PURE__ */ jsx("p", { children: "Comparison" }), /* @__PURE__ */ jsx("h3", { children: "Before and After" })]
					}), /* @__PURE__ */ jsx("div", {
						className: "hint",
						children: "Drag to compare"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "compare-stage",
					children: project?.sourceImage && currentImage ? /* @__PURE__ */ jsx(ReactCompareSlider, {
						defaultValue: 50,
						style: {
							width: "100%",
							height: "auto"
						},
						itemOne: /* @__PURE__ */ jsx(ReactCompareSliderImage, {
							src: project?.sourceImage,
							alt: "before",
							className: "compare-img"
						}),
						itemTwo: /* @__PURE__ */ jsx(ReactCompareSliderImage, {
							src: currentImage || project?.renderedImage,
							alt: "after",
							className: "compare-img"
						})
					}) : /* @__PURE__ */ jsx("div", {
						className: "compare-fallback",
						children: project?.sourceImage && /* @__PURE__ */ jsx("img", {
							src: project.sourceImage,
							alt: "Before",
							className: "compare-img"
						})
					})
				})]
			})]
		})]
	});
};
var visualizer_$id_default = UNSAFE_withComponentProps(VisualizerId);
//#endregion
//#region app/routes/product.tsx
var product_exports = /* @__PURE__ */ __exportAll({
	default: () => product_default,
	meta: () => meta$11
});
function meta$11({}) {
	return [{ title: "Product - Roomify" }, {
		name: "description",
		content: "Explore Roomify's powerful features for architectural visualization"
	}];
}
var product_default = UNSAFE_withComponentProps(function Product() {
	return /* @__PURE__ */ jsxs("div", {
		className: "product-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero product-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Powerful Features for Modern Architects" }), /* @__PURE__ */ jsx("p", { children: "Everything you need to transform your architectural vision into reality" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "features-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "section-head",
						children: [/* @__PURE__ */ jsx("h2", { children: "Why Choose Roomify?" }), /* @__PURE__ */ jsx("p", { children: "Industry-leading AI technology meets intuitive design" })]
					}), /* @__PURE__ */ jsx("div", {
						className: "features-grid",
						children: [
							{
								icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }),
								title: "2D-to-3D Visualization",
								description: "Instantly transform flat floor plans into photorealistic 3D models using state-of-the-art AI"
							},
							{
								icon: /* @__PURE__ */ jsx(Lightbulb, { className: "w-6 h-6" }),
								title: "AI-Powered Rendering",
								description: "Powered by Claude and Gemini AI models for intelligent architectural transformations"
							},
							{
								icon: /* @__PURE__ */ jsx(Share2, { className: "w-6 h-6" }),
								title: "Global Community Feed",
								description: "Share your projects with the world and discover inspiring architectural designs"
							},
							{
								icon: /* @__PURE__ */ jsx(Lock, { className: "w-6 h-6" }),
								title: "Privacy Controls",
								description: "Granular public and private toggles for complete control over your data"
							},
							{
								icon: /* @__PURE__ */ jsx(Gauge, { className: "w-6 h-6" }),
								title: "High-Performance Hosting",
								description: "Permanent file storage with instant loading and metadata persistence"
							},
							{
								icon: /* @__PURE__ */ jsx(Check, { className: "w-6 h-6" }),
								title: "One-Click Export",
								description: "Download and integrate renders into your presentations and workflows"
							}
						].map((feature, idx) => /* @__PURE__ */ jsxs("div", {
							className: "feature-card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "feature-icon",
									children: feature.icon
								}),
								/* @__PURE__ */ jsx("h3", { children: feature.title }),
								/* @__PURE__ */ jsx("p", { children: feature.description })
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "cta-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "cta-inner",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Ready to Transform Your Designs?" }),
						/* @__PURE__ */ jsx("p", { children: "Join thousands of architects already using Roomify" }),
						/* @__PURE__ */ jsx("a", {
							href: "/",
							className: "cta-button",
							children: "Start Building Now"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/pricing.tsx
var pricing_exports = /* @__PURE__ */ __exportAll({
	default: () => pricing_default,
	meta: () => meta$10
});
function meta$10({}) {
	return [{ title: "Pricing - Roomify" }, {
		name: "description",
		content: "Affordable pricing plans for architects of all sizes"
	}];
}
var pricing_default = UNSAFE_withComponentProps(function Pricing() {
	return /* @__PURE__ */ jsxs("div", {
		className: "pricing-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero pricing-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Simple, Transparent Pricing" }), /* @__PURE__ */ jsx("p", { children: "Choose the perfect plan for your architectural needs" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pricing-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsx("div", {
						className: "pricing-grid",
						children: [
							{
								name: "Starter",
								price: "$29",
								period: "/month",
								description: "Perfect for individual architects",
								features: [
									"5 projects per month",
									"Basic AI rendering",
									"2D-to-3D visualization",
									"Private project storage",
									"Email support",
									"1GB storage"
								],
								cta: "Get Started",
								featured: false
							},
							{
								name: "Professional",
								price: "$79",
								period: "/month",
								description: "For growing design teams",
								features: [
									"Unlimited projects",
									"Advanced AI rendering",
									"Priority processing",
									"Team collaboration",
									"Community sharing",
									"Priority support",
									"50GB storage",
									"Custom exports"
								],
								cta: "Start Free Trial",
								featured: true
							},
							{
								name: "Enterprise",
								price: "Custom",
								period: "pricing",
								description: "For large organizations",
								features: [
									"Everything in Professional",
									"Dedicated account manager",
									"Custom AI models",
									"White-label options",
									"API access",
									"Unlimited storage",
									"24/7 support",
									"SLA guarantee"
								],
								cta: "Contact Sales",
								featured: false
							}
						].map((plan, idx) => /* @__PURE__ */ jsxs("div", {
							className: `pricing-card ${plan.featured ? "featured" : ""}`,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "card-header",
									children: [/* @__PURE__ */ jsx("h3", { children: plan.name }), /* @__PURE__ */ jsx("p", { children: plan.description })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "card-price",
									children: [/* @__PURE__ */ jsx("span", {
										className: "price",
										children: plan.price
									}), /* @__PURE__ */ jsx("span", {
										className: "period",
										children: plan.period
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									className: `pricing-cta ${plan.featured ? "primary" : "secondary"}`,
									children: plan.cta
								}),
								/* @__PURE__ */ jsx("div", {
									className: "features-list",
									children: plan.features.map((feature, featureIdx) => /* @__PURE__ */ jsxs("div", {
										className: "feature-item",
										children: [/* @__PURE__ */ jsx(Check, { size: 18 }), /* @__PURE__ */ jsx("span", { children: feature })]
									}, featureIdx))
								})
							]
						}, idx))
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "faq-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsx("h2", { children: "Frequently Asked Questions" }), /* @__PURE__ */ jsxs("div", {
						className: "faq-grid",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "faq-item",
								children: [/* @__PURE__ */ jsx("h4", { children: "Can I change plans anytime?" }), /* @__PURE__ */ jsx("p", { children: "Yes, upgrade or downgrade your plan at any time with changes taking effect immediately." })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "faq-item",
								children: [/* @__PURE__ */ jsx("h4", { children: "Is there a free trial?" }), /* @__PURE__ */ jsx("p", { children: "Yes, Professional plan includes a 14-day free trial with full access to all features." })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "faq-item",
								children: [/* @__PURE__ */ jsx("h4", { children: "What payment methods do you accept?" }), /* @__PURE__ */ jsx("p", { children: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans." })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "faq-item",
								children: [/* @__PURE__ */ jsx("h4", { children: "Is there a discount for annual billing?" }), /* @__PURE__ */ jsx("p", { children: "Yes, save 20% with annual billing on all plans." })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/community.tsx
var community_exports = /* @__PURE__ */ __exportAll({
	default: () => community_default,
	meta: () => meta$9
});
function meta$9({}) {
	return [{ title: "Community - Roomify" }, {
		name: "description",
		content: "Discover inspiring architectural projects from our community"
	}];
}
var community_default = UNSAFE_withComponentProps(function Community() {
	const [projects, setProjects] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchCommunityProjects = async () => {
			try {
				setIsLoading(true);
				setProjects(await getProjects() || []);
			} catch (error) {
				console.error("Failed to fetch community projects:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchCommunityProjects();
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "community-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero community-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Global Community Gallery" }), /* @__PURE__ */ jsx("p", { children: "Discover inspiring architectural projects from creators around the world" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "community-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "section-head",
						children: [/* @__PURE__ */ jsx("h2", { children: "Featured Projects" }), /* @__PURE__ */ jsx("p", { children: "Explore amazing designs and get inspired by our community" })]
					}), isLoading ? /* @__PURE__ */ jsx("div", {
						className: "loading",
						children: /* @__PURE__ */ jsx("p", { children: "Loading community projects..." })
					}) : projects.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "empty-state",
						children: /* @__PURE__ */ jsx("p", { children: "No projects shared yet. Be the first to share your creation!" })
					}) : /* @__PURE__ */ jsx("div", {
						className: "projects-grid",
						children: projects.map((project) => /* @__PURE__ */ jsxs("div", {
							className: "project-card community-card",
							onClick: () => navigate(`/visualizer/${project.id}`),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "preview",
								children: [/* @__PURE__ */ jsx("img", {
									src: project.renderedImage || project.sourceImage,
									alt: project.name,
									onError: (e) => {
										e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
									}
								}), /* @__PURE__ */ jsx("div", {
									className: "overlay",
									children: /* @__PURE__ */ jsxs("button", {
										className: "view-btn",
										children: ["View Project ", /* @__PURE__ */ jsx(ArrowUpRight, { size: 16 })]
									})
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "card-body",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "card-header",
									children: [/* @__PURE__ */ jsx("h3", { children: project.name }), /* @__PURE__ */ jsxs("div", {
										className: "actions",
										children: [/* @__PURE__ */ jsx("button", {
											className: "action-btn",
											children: /* @__PURE__ */ jsx(Heart, { size: 16 })
										}), /* @__PURE__ */ jsx("button", {
											className: "action-btn",
											children: /* @__PURE__ */ jsx(Share2, { size: 16 })
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "card-meta",
									children: [
										/* @__PURE__ */ jsx(Clock, { size: 12 }),
										/* @__PURE__ */ jsx("span", { children: new Date(project.timestamp).toLocaleDateString() }),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsx("span", { children: "By Community" })
									]
								})]
							})]
						}, project.id))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "cta-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "cta-inner",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Share Your Design with the World" }),
						/* @__PURE__ */ jsx("p", { children: "Upload your floor plan and let the community see your creation" }),
						/* @__PURE__ */ jsx("a", {
							href: "/",
							className: "cta-button",
							children: "Upload Your Project"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/enterprise.tsx
var enterprise_exports = /* @__PURE__ */ __exportAll({
	default: () => enterprise_default,
	meta: () => meta$8
});
function meta$8({}) {
	return [{ title: "Enterprise - Roomify" }, {
		name: "description",
		content: "Enterprise solutions for large organizations and teams"
	}];
}
var enterprise_default = UNSAFE_withComponentProps(function Enterprise() {
	return /* @__PURE__ */ jsxs("div", {
		className: "enterprise-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero enterprise-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [
						/* @__PURE__ */ jsx("h1", { children: "Enterprise Solutions for Large Organizations" }),
						/* @__PURE__ */ jsx("p", { children: "Powerful tools and dedicated support for teams that demand the best" }),
						/* @__PURE__ */ jsx(Button, {
							size: "lg",
							className: "cta-button",
							children: "Schedule a Demo"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "benefits-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsx("h2", { children: "Enterprise Benefits" }), /* @__PURE__ */ jsx("div", {
						className: "benefits-grid",
						children: [
							{
								icon: /* @__PURE__ */ jsx(Users, { className: "w-8 h-8" }),
								title: "Team Collaboration",
								description: "Seamless collaboration tools for large architectural teams"
							},
							{
								icon: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8" }),
								title: "Enterprise Security",
								description: "Advanced security features including SSO, 2FA, and role-based access"
							},
							{
								icon: /* @__PURE__ */ jsx(Zap, { className: "w-8 h-8" }),
								title: "Custom Integration",
								description: "API access and custom integrations with your existing tools"
							},
							{
								icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8" }),
								title: "Advanced Analytics",
								description: "Comprehensive analytics and reporting dashboards"
							}
						].map((benefit, idx) => /* @__PURE__ */ jsxs("div", {
							className: "benefit-card",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "benefit-icon",
									children: benefit.icon
								}),
								/* @__PURE__ */ jsx("h3", { children: benefit.title }),
								/* @__PURE__ */ jsx("p", { children: benefit.description })
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "use-cases-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsx("h2", { children: "Who Uses Roomify Enterprise?" }), /* @__PURE__ */ jsx("div", {
						className: "use-cases-grid",
						children: [
							{
								title: "Architecture Firms",
								description: "Streamline your design workflow and collaborate with teams across offices"
							},
							{
								title: "Real Estate Development",
								description: "Accelerate project visualization and client presentations"
							},
							{
								title: "Interior Design Studios",
								description: "Transform 2D floor plans into stunning 3D visualizations instantly"
							},
							{
								title: "Construction Companies",
								description: "Improve project planning and stakeholder communication"
							}
						].map((useCase, idx) => /* @__PURE__ */ jsxs("div", {
							className: "use-case-card",
							children: [
								/* @__PURE__ */ jsx(CheckCircle, { className: "check-icon" }),
								/* @__PURE__ */ jsx("h3", { children: useCase.title }),
								/* @__PURE__ */ jsx("p", { children: useCase.description })
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "features-table-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsx("h2", { children: "Enterprise Features" }), /* @__PURE__ */ jsxs("table", {
						className: "features-table",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", { children: "Feature" }),
							/* @__PURE__ */ jsx("th", { children: "Professional" }),
							/* @__PURE__ */ jsx("th", { children: "Enterprise" })
						] }) }), /* @__PURE__ */ jsxs("tbody", { children: [
							/* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: "Team Members" }),
								/* @__PURE__ */ jsx("td", { children: "Up to 5" }),
								/* @__PURE__ */ jsx("td", { children: "Unlimited" })
							] }),
							/* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: "API Access" }),
								/* @__PURE__ */ jsx("td", { children: "No" }),
								/* @__PURE__ */ jsx("td", { children: "Yes" })
							] }),
							/* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: "Custom Branding" }),
								/* @__PURE__ */ jsx("td", { children: "No" }),
								/* @__PURE__ */ jsx("td", { children: "Yes" })
							] }),
							/* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: "SSO Authentication" }),
								/* @__PURE__ */ jsx("td", { children: "No" }),
								/* @__PURE__ */ jsx("td", { children: "Yes" })
							] }),
							/* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: "Dedicated Support" }),
								/* @__PURE__ */ jsx("td", { children: "Email" }),
								/* @__PURE__ */ jsx("td", { children: "24/7 Phone & Email" })
							] }),
							/* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", { children: "SLA Guarantee" }),
								/* @__PURE__ */ jsx("td", { children: "No" }),
								/* @__PURE__ */ jsx("td", { children: "99.9% Uptime" })
							] })
						] })]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pricing-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Custom Pricing" }),
						/* @__PURE__ */ jsx("p", { children: "Contact our sales team for a customized pricing plan based on your organization's needs" }),
						/* @__PURE__ */ jsx(Button, {
							size: "lg",
							className: "contact-button",
							children: "Contact Sales Team"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "testimonials-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [/* @__PURE__ */ jsx("h2", { children: "What Enterprise Clients Say" }), /* @__PURE__ */ jsxs("div", {
						className: "testimonials-grid",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "testimonial-card",
								children: [/* @__PURE__ */ jsx("p", {
									className: "quote",
									children: "\"Roomify has transformed how we visualize architectural designs for our clients. The time savings are incredible.\""
								}), /* @__PURE__ */ jsx("p", {
									className: "author",
									children: "- John Smith, Principal Architect at Premier Design Studio"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "testimonial-card",
								children: [/* @__PURE__ */ jsx("p", {
									className: "quote",
									children: "\"The team collaboration features have made it easy for our distributed offices to work together seamlessly.\""
								}), /* @__PURE__ */ jsx("p", {
									className: "author",
									children: "- Sarah Johnson, Director of Operations at Global Construction Inc."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "testimonial-card",
								children: [/* @__PURE__ */ jsx("p", {
									className: "quote",
									children: "\"Enterprise support is fantastic. They've helped us integrate Roomify perfectly into our workflow.\""
								}), /* @__PURE__ */ jsx("p", {
									className: "author",
									children: "- Michael Chen, CTO at Urban Development Partners"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "cta-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "cta-inner",
					children: [
						/* @__PURE__ */ jsx("h2", { children: "Ready to Transform Your Organization?" }),
						/* @__PURE__ */ jsx("p", { children: "Let's talk about how Roomify Enterprise can accelerate your business" }),
						/* @__PURE__ */ jsx(Button, {
							size: "lg",
							className: "cta-button",
							children: "Schedule a Demo"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	meta: () => meta$7
});
function meta$7({}) {
	return [{ title: "About - Roomify" }, {
		name: "description",
		content: "Learn about Roomify and our mission"
	}];
}
var about_default = UNSAFE_withComponentProps(function About() {
	return /* @__PURE__ */ jsxs("div", {
		className: "about-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero about-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "About Roomify" }), /* @__PURE__ */ jsx("p", { children: "Revolutionizing architectural visualization with AI" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "content-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "content-block",
							children: [/* @__PURE__ */ jsx("h2", { children: "Our Mission" }), /* @__PURE__ */ jsx("p", { children: "At Roomify, we believe that architectural visualization should be fast, affordable, and accessible to everyone. We're building the future of design with AI-powered 3D rendering that transforms 2D floor plans into photorealistic visualizations in minutes, not days." })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "content-block",
							children: [/* @__PURE__ */ jsx("h2", { children: "Our Story" }), /* @__PURE__ */ jsx("p", { children: "Founded by a team of architects and AI engineers, Roomify was born from frustration with existing visualization tools. We saw an opportunity to combine cutting-edge AI technology with modern web platforms to create something truly revolutionary." })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "content-block",
							children: [/* @__PURE__ */ jsx("h2", { children: "Our Team" }), /* @__PURE__ */ jsx("p", { children: "Our diverse team includes architects, software engineers, AI specialists, and product designers working together to deliver exceptional results. We're passionate about using technology to solve real problems in the architecture and design industry." })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "content-block",
							children: [
								/* @__PURE__ */ jsx("h2", { children: "Creator" }),
								/* @__PURE__ */ jsxs("p", { children: ["Roomify is developed by ", /* @__PURE__ */ jsx("strong", { children: "Swaraj Fugare" })] }),
								/* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
									href: "https://portfolio.matoshreecollection.in/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "link",
									children: "Visit Portfolio"
								}) })
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/privacy.tsx
var privacy_exports = /* @__PURE__ */ __exportAll({
	default: () => privacy_default,
	meta: () => meta$6
});
function meta$6({}) {
	return [{ title: "Privacy Policy - Roomify" }, {
		name: "description",
		content: "Roomify Privacy Policy"
	}];
}
var privacy_default = UNSAFE_withComponentProps(function Privacy() {
	return /* @__PURE__ */ jsxs("div", {
		className: "legal-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero legal-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Privacy Policy" }), /* @__PURE__ */ jsxs("p", { children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "content-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsxs("div", {
						className: "legal-content",
						children: [
							/* @__PURE__ */ jsx("h2", { children: "1. Introduction" }),
							/* @__PURE__ */ jsx("p", { children: "Roomify (\"we\", \"us\", \"our\") operates the Roomify website and application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data." }),
							/* @__PURE__ */ jsx("h2", { children: "2. Information Collection and Use" }),
							/* @__PURE__ */ jsx("p", { children: "We collect several different types of information for various purposes to provide and improve our service to you." }),
							/* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Account Information:" }), " Name, email address, password, and usage data"] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Uploaded Content:" }), " Floor plans and images you upload for processing"] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Usage Data:" }), " Log data, including IP address, browser type, pages visited, and time spent"] })
							] }),
							/* @__PURE__ */ jsx("h2", { children: "3. Use of Data" }),
							/* @__PURE__ */ jsx("p", { children: "Roomify uses the collected data for various purposes including:" }),
							/* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsx("li", { children: "Providing and maintaining our service" }),
								/* @__PURE__ */ jsx("li", { children: "Processing and storing your architectural projects" }),
								/* @__PURE__ */ jsx("li", { children: "Notifying you about changes to our service" }),
								/* @__PURE__ */ jsx("li", { children: "Detecting and preventing fraudulent transactions and other illegal activities" })
							] }),
							/* @__PURE__ */ jsx("h2", { children: "4. Security of Data" }),
							/* @__PURE__ */ jsx("p", { children: "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security." }),
							/* @__PURE__ */ jsx("h2", { children: "5. Contact Us" }),
							/* @__PURE__ */ jsx("p", { children: "If you have any questions about this Privacy Policy, please contact us at hello@roomify.com" })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/terms.tsx
var terms_exports = /* @__PURE__ */ __exportAll({
	default: () => terms_default,
	meta: () => meta$5
});
function meta$5({}) {
	return [{ title: "Terms of Service - Roomify" }, {
		name: "description",
		content: "Roomify Terms of Service"
	}];
}
var terms_default = UNSAFE_withComponentProps(function Terms() {
	return /* @__PURE__ */ jsxs("div", {
		className: "legal-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero legal-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Terms of Service" }), /* @__PURE__ */ jsxs("p", { children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "content-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsxs("div", {
						className: "legal-content",
						children: [
							/* @__PURE__ */ jsx("h2", { children: "1. Agreement to Terms" }),
							/* @__PURE__ */ jsx("p", { children: "By accessing and using the Roomify website and application, you accept and agree to be bound by the terms and provision of this agreement." }),
							/* @__PURE__ */ jsx("h2", { children: "2. Use License" }),
							/* @__PURE__ */ jsx("p", { children: "Permission is granted to temporarily download one copy of the materials (information or software) on Roomify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title." }),
							/* @__PURE__ */ jsx("h2", { children: "3. Disclaimer" }),
							/* @__PURE__ */ jsx("p", { children: "The materials on Roomify are provided on an \"as is\" basis. Roomify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights." }),
							/* @__PURE__ */ jsx("h2", { children: "4. Limitations" }),
							/* @__PURE__ */ jsx("p", { children: "In no event shall Roomify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Roomify." }),
							/* @__PURE__ */ jsx("h2", { children: "5. Accuracy of Materials" }),
							/* @__PURE__ */ jsx("p", { children: "The materials appearing on Roomify could include technical, typographical, or photographic errors. Roomify does not warrant that any of the materials on the website are accurate, complete, or current." }),
							/* @__PURE__ */ jsx("h2", { children: "6. Links" }),
							/* @__PURE__ */ jsx("p", { children: "Roomify has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Roomify of the site. Use of any such linked website is at the user's own risk." }),
							/* @__PURE__ */ jsx("h2", { children: "7. Modifications" }),
							/* @__PURE__ */ jsx("p", { children: "Roomify may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service." }),
							/* @__PURE__ */ jsx("h2", { children: "8. Governing Law" }),
							/* @__PURE__ */ jsx("p", { children: "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Roomify operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location." })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/security.tsx
var security_exports = /* @__PURE__ */ __exportAll({
	default: () => security_default,
	meta: () => meta$4
});
function meta$4({}) {
	return [{ title: "Security - Roomify" }, {
		name: "description",
		content: "Roomify Security Information"
	}];
}
var security_default = UNSAFE_withComponentProps(function Security() {
	return /* @__PURE__ */ jsxs("div", {
		className: "legal-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero legal-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Security" }), /* @__PURE__ */ jsx("p", { children: "Your data security is our top priority" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "content-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsxs("div", {
						className: "legal-content",
						children: [
							/* @__PURE__ */ jsx("h2", { children: "Security Measures" }),
							/* @__PURE__ */ jsx("p", { children: "Roomify is committed to protecting your information with industry-leading security practices." }),
							/* @__PURE__ */ jsx("h2", { children: "Data Encryption" }),
							/* @__PURE__ */ jsx("p", { children: "All data transmitted between your browser and our servers is encrypted using HTTPS/TLS encryption protocols. Your uploaded files are encrypted at rest on our secure servers." }),
							/* @__PURE__ */ jsx("h2", { children: "Access Control" }),
							/* @__PURE__ */ jsx("p", { children: "We implement strict access controls to ensure that only authorized personnel can access your personal data. All access is logged and monitored." }),
							/* @__PURE__ */ jsx("h2", { children: "Regular Audits" }),
							/* @__PURE__ */ jsx("p", { children: "We conduct regular security audits and penetration testing to identify and address potential vulnerabilities in our systems." }),
							/* @__PURE__ */ jsx("h2", { children: "Secure Infrastructure" }),
							/* @__PURE__ */ jsx("p", { children: "Our infrastructure is hosted on secure cloud providers with enterprise-grade security measures including firewalls, intrusion detection, and DDoS protection." }),
							/* @__PURE__ */ jsx("h2", { children: "Password Security" }),
							/* @__PURE__ */ jsx("p", { children: "We use industry-standard password hashing algorithms to store passwords securely. We recommend using strong, unique passwords for your account." }),
							/* @__PURE__ */ jsx("h2", { children: "Two-Factor Authentication" }),
							/* @__PURE__ */ jsx("p", { children: "We support two-factor authentication (2FA) to add an extra layer of security to your account. We encourage all users to enable 2FA." }),
							/* @__PURE__ */ jsx("h2", { children: "Incident Response" }),
							/* @__PURE__ */ jsx("p", { children: "In the unlikely event of a security incident, we have a dedicated incident response team that will notify affected users promptly." }),
							/* @__PURE__ */ jsx("h2", { children: "Report a Vulnerability" }),
							/* @__PURE__ */ jsx("p", { children: "If you discover a security vulnerability in Roomify, please email us at security@roomify.com with details. We appreciate responsible disclosure." })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/cookies.tsx
var cookies_exports = /* @__PURE__ */ __exportAll({
	default: () => cookies_default,
	meta: () => meta$3
});
function meta$3({}) {
	return [{ title: "Cookie Policy - Roomify" }, {
		name: "description",
		content: "Roomify Cookie Policy"
	}];
}
var cookies_default = UNSAFE_withComponentProps(function Cookies() {
	return /* @__PURE__ */ jsxs("div", {
		className: "legal-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero legal-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Cookie Policy" }), /* @__PURE__ */ jsxs("p", { children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "content-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsxs("div", {
						className: "legal-content",
						children: [
							/* @__PURE__ */ jsx("h2", { children: "What Are Cookies?" }),
							/* @__PURE__ */ jsx("p", { children: "Cookies are small files of letters and numbers that we store on your browser or the hard drive of your computer. They contain information about your browsing activities on our website." }),
							/* @__PURE__ */ jsx("h2", { children: "How We Use Cookies" }),
							/* @__PURE__ */ jsx("p", { children: "We use cookies to:" }),
							/* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsx("li", { children: "Remember your preferences and login information" }),
								/* @__PURE__ */ jsx("li", { children: "Track your usage of our service" }),
								/* @__PURE__ */ jsx("li", { children: "Improve the performance of our website" }),
								/* @__PURE__ */ jsx("li", { children: "Analyze how users interact with our service" }),
								/* @__PURE__ */ jsx("li", { children: "Provide you with personalized content" })
							] }),
							/* @__PURE__ */ jsx("h2", { children: "Types of Cookies We Use" }),
							/* @__PURE__ */ jsxs("ul", { children: [
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Essential Cookies:" }), " Required for authentication and security"] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Performance Cookies:" }), " Help us understand how you use our service"] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Functionality Cookies:" }), " Remember your preferences and settings"] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Analytics Cookies:" }), " Track usage patterns to improve our service"] })
							] }),
							/* @__PURE__ */ jsx("h2", { children: "Third-Party Cookies" }),
							/* @__PURE__ */ jsx("p", { children: "We use third-party analytics services that may place cookies on your device. These are used solely to improve our service and understand user behavior." }),
							/* @__PURE__ */ jsx("h2", { children: "Managing Cookies" }),
							/* @__PURE__ */ jsx("p", { children: "You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect the functionality of our website." }),
							/* @__PURE__ */ jsx("h2", { children: "Contact Us" }),
							/* @__PURE__ */ jsx("p", { children: "If you have questions about our cookie policy, please contact us at privacy@roomify.com" })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/blog.tsx
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => blog_default,
	meta: () => meta$2
});
function meta$2({}) {
	return [{ title: "Blog - Roomify" }, {
		name: "description",
		content: "Read latest articles about architectural visualization and AI"
	}];
}
var blog_default = UNSAFE_withComponentProps(function Blog() {
	return /* @__PURE__ */ jsxs("div", {
		className: "blog-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero blog-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Roomify Blog" }), /* @__PURE__ */ jsx("p", { children: "Insights on AI, architecture, and design innovation" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "blog-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsx("div", {
						className: "blog-grid",
						children: [
							{
								id: 1,
								title: "The Future of Architectural Visualization",
								excerpt: "AI is revolutionizing how architects visualize their designs. Learn about the latest trends.",
								date: "June 20, 2024",
								author: "Swaraj Fugare"
							},
							{
								id: 2,
								title: "How to Create Better Floor Plans",
								excerpt: "Tips and tricks for creating floor plans that render beautifully with AI tools.",
								date: "June 15, 2024",
								author: "Swaraj Fugare"
							},
							{
								id: 3,
								title: "AI-Powered Design: What's Next?",
								excerpt: "Exploring the possibilities of AI in architectural design and visualization.",
								date: "June 10, 2024",
								author: "Swaraj Fugare"
							}
						].map((post) => /* @__PURE__ */ jsxs("article", {
							className: "blog-card",
							children: [
								/* @__PURE__ */ jsx("h2", { children: post.title }),
								/* @__PURE__ */ jsx("p", {
									className: "excerpt",
									children: post.excerpt
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "meta",
									children: [/* @__PURE__ */ jsx("span", {
										className: "date",
										children: post.date
									}), /* @__PURE__ */ jsxs("span", {
										className: "author",
										children: ["By ", post.author]
									})]
								})
							]
						}, post.id))
					})
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/careers.tsx
var careers_exports = /* @__PURE__ */ __exportAll({
	default: () => careers_default,
	meta: () => meta$1
});
function meta$1({}) {
	return [{ title: "Careers - Roomify" }, {
		name: "description",
		content: "Join the Roomify team"
	}];
}
var careers_default = UNSAFE_withComponentProps(function Careers() {
	return /* @__PURE__ */ jsxs("div", {
		className: "careers-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero careers-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Join Our Team" }), /* @__PURE__ */ jsx("p", { children: "Help us revolutionize architectural visualization" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "content-section",
				children: /* @__PURE__ */ jsxs("div", {
					className: "section-inner",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "content-block",
							children: [/* @__PURE__ */ jsx("h2", { children: "Why Join Roomify?" }), /* @__PURE__ */ jsx("p", { children: "We're a talented team of architects, engineers, and designers working on cutting-edge AI technology. We offer competitive salaries, flexible work arrangements, and the opportunity to work on projects that matter." })]
						}),
						/* @__PURE__ */ jsx("h2", { children: "Open Positions" }),
						/* @__PURE__ */ jsx("div", {
							className: "jobs-grid",
							children: [
								{
									title: "Senior Frontend Engineer",
									location: "Remote",
									type: "Full-time"
								},
								{
									title: "AI/ML Engineer",
									location: "Remote",
									type: "Full-time"
								},
								{
									title: "Product Designer",
									location: "Remote",
									type: "Full-time"
								},
								{
									title: "DevOps Engineer",
									location: "Remote",
									type: "Full-time"
								}
							].map((job, idx) => /* @__PURE__ */ jsxs("div", {
								className: "job-card",
								children: [/* @__PURE__ */ jsx("h3", { children: job.title }), /* @__PURE__ */ jsxs("div", {
									className: "job-meta",
									children: [/* @__PURE__ */ jsx("span", {
										className: "location",
										children: job.location
									}), /* @__PURE__ */ jsx("span", {
										className: "type",
										children: job.type
									})]
								})]
							}, idx))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "content-block",
							children: [/* @__PURE__ */ jsx("h2", { children: "Don't see the right role?" }), /* @__PURE__ */ jsx("p", { children: "We're always looking for talented individuals. Feel free to reach out at careers@roomify.com with your resume and let us know how you'd like to contribute." })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region app/routes/contact.tsx
var contact_exports = /* @__PURE__ */ __exportAll({
	default: () => contact_default,
	meta: () => meta
});
function meta({}) {
	return [{ title: "Contact - Roomify" }, {
		name: "description",
		content: "Get in touch with the Roomify team"
	}];
}
var contact_default = UNSAFE_withComponentProps(function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		alert("Thank you for your message! We'll get back to you soon.");
		setFormData({
			name: "",
			email: "",
			subject: "",
			message: ""
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "contact-page",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("section", {
				className: "hero contact-hero",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-content",
					children: [/* @__PURE__ */ jsx("h1", { children: "Get In Touch" }), /* @__PURE__ */ jsx("p", { children: "We'd love to hear from you" })]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "contact-section",
				children: /* @__PURE__ */ jsx("div", {
					className: "section-inner",
					children: /* @__PURE__ */ jsxs("div", {
						className: "contact-grid",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "contact-info",
							children: [
								/* @__PURE__ */ jsx("h2", { children: "Contact Information" }),
								/* @__PURE__ */ jsxs("div", {
									className: "info-item",
									children: [/* @__PURE__ */ jsx(Mail, { size: 24 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: "Email" }), /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
										href: "mailto:hello@roomify.com",
										children: "hello@roomify.com"
									}) })] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "info-item",
									children: [/* @__PURE__ */ jsx(Phone, { size: 24 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: "Phone" }), /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", {
										href: "tel:+1234567890",
										children: "+1 (234) 567-890"
									}) })] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "info-item",
									children: [/* @__PURE__ */ jsx(MapPin, { size: 24 }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", { children: "Office" }), /* @__PURE__ */ jsx("p", { children: "Remote-First Company" })] })]
								})
							]
						}), /* @__PURE__ */ jsxs("form", {
							className: "contact-form",
							onSubmit: handleSubmit,
							children: [
								/* @__PURE__ */ jsx("h2", { children: "Send us a Message" }),
								/* @__PURE__ */ jsxs("div", {
									className: "form-group",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "name",
										children: "Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										id: "name",
										name: "name",
										value: formData.name,
										onChange: handleChange,
										required: true,
										placeholder: "Your name"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "form-group",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "email",
										children: "Email"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										id: "email",
										name: "email",
										value: formData.email,
										onChange: handleChange,
										required: true,
										placeholder: "your@email.com"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "form-group",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "subject",
										children: "Subject"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										id: "subject",
										name: "subject",
										value: formData.subject,
										onChange: handleChange,
										required: true,
										placeholder: "How can we help?"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "form-group",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "message",
										children: "Message"
									}), /* @__PURE__ */ jsx("textarea", {
										id: "message",
										name: "message",
										value: formData.message,
										onChange: handleChange,
										required: true,
										rows: 5,
										placeholder: "Tell us more..."
									})]
								}),
								/* @__PURE__ */ jsx(Button, {
									type: "submit",
									size: "lg",
									className: "submit-btn",
									children: "Send Message"
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client--dlg9qh4.js",
		"imports": [
			"/assets/jsx-runtime-CbMb_4Hb.js",
			"/assets/components-C8MOW67N.js",
			"/assets/preload-helper-CZgWQFsJ.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-D7JMN8-0.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/components-C8MOW67N.js",
				"/assets/preload-helper-CZgWQFsJ.js",
				"/assets/puter.action-DLLSZpGF.js"
			],
			"css": ["/assets/root-Dbxab-yl.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-DPQJPRNg.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/puter.action-DLLSZpGF.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/clock-Cfo7eMQu.js",
				"/assets/preload-helper-CZgWQFsJ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/visualizer.$id": {
			"id": "routes/visualizer.$id",
			"parentId": "root",
			"path": "visualizer/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/visualizer._id-CnEdnwMQ.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/puter.action-DLLSZpGF.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/share-2-BemYehHL.js",
				"/assets/preload-helper-CZgWQFsJ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/product": {
			"id": "routes/product",
			"parentId": "root",
			"path": "product",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/product-Drfxw2TI.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/check-CsrZmxNT.js",
				"/assets/share-2-BemYehHL.js",
				"/assets/zap-DDILaZ81.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/pricing": {
			"id": "routes/pricing",
			"parentId": "root",
			"path": "pricing",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/pricing-bjfV37ia.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/check-CsrZmxNT.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/community": {
			"id": "routes/community",
			"parentId": "root",
			"path": "community",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/community-DszAJsXo.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/puter.action-DLLSZpGF.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/clock-Cfo7eMQu.js",
				"/assets/share-2-BemYehHL.js",
				"/assets/preload-helper-CZgWQFsJ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/enterprise": {
			"id": "routes/enterprise",
			"parentId": "root",
			"path": "enterprise",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/enterprise-B1q3Z0LR.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/zap-DDILaZ81.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-_m1E2s86.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/privacy": {
			"id": "routes/privacy",
			"parentId": "root",
			"path": "privacy",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/privacy-VP32wfHH.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/terms": {
			"id": "routes/terms",
			"parentId": "root",
			"path": "terms",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/terms-sYb3RL71.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/security": {
			"id": "routes/security",
			"parentId": "root",
			"path": "security",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/security-jbjimDvs.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/cookies": {
			"id": "routes/cookies",
			"parentId": "root",
			"path": "cookies",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/cookies-BX4kg3nX.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/blog": {
			"id": "routes/blog",
			"parentId": "root",
			"path": "blog",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/blog-DR30jrTM.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/careers": {
			"id": "routes/careers",
			"parentId": "root",
			"path": "careers",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/careers-DMSwflE8.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Footer--BiX5TTZ.js",
				"/assets/Button-Bu-Z73Q-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/contact": {
			"id": "routes/contact",
			"parentId": "root",
			"path": "contact",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/contact-Br8-7Bhx.js",
			"imports": [
				"/assets/jsx-runtime-CbMb_4Hb.js",
				"/assets/Button-Bu-Z73Q-.js",
				"/assets/Footer--BiX5TTZ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-3f9ff1c0.js",
	"version": "3f9ff1c0",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = { "unstable_optimizeDeps": false };
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/visualizer.$id": {
		id: "routes/visualizer.$id",
		parentId: "root",
		path: "visualizer/:id",
		index: void 0,
		caseSensitive: void 0,
		module: visualizer_$id_exports
	},
	"routes/product": {
		id: "routes/product",
		parentId: "root",
		path: "product",
		index: void 0,
		caseSensitive: void 0,
		module: product_exports
	},
	"routes/pricing": {
		id: "routes/pricing",
		parentId: "root",
		path: "pricing",
		index: void 0,
		caseSensitive: void 0,
		module: pricing_exports
	},
	"routes/community": {
		id: "routes/community",
		parentId: "root",
		path: "community",
		index: void 0,
		caseSensitive: void 0,
		module: community_exports
	},
	"routes/enterprise": {
		id: "routes/enterprise",
		parentId: "root",
		path: "enterprise",
		index: void 0,
		caseSensitive: void 0,
		module: enterprise_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/privacy": {
		id: "routes/privacy",
		parentId: "root",
		path: "privacy",
		index: void 0,
		caseSensitive: void 0,
		module: privacy_exports
	},
	"routes/terms": {
		id: "routes/terms",
		parentId: "root",
		path: "terms",
		index: void 0,
		caseSensitive: void 0,
		module: terms_exports
	},
	"routes/security": {
		id: "routes/security",
		parentId: "root",
		path: "security",
		index: void 0,
		caseSensitive: void 0,
		module: security_exports
	},
	"routes/cookies": {
		id: "routes/cookies",
		parentId: "root",
		path: "cookies",
		index: void 0,
		caseSensitive: void 0,
		module: cookies_exports
	},
	"routes/blog": {
		id: "routes/blog",
		parentId: "root",
		path: "blog",
		index: void 0,
		caseSensitive: void 0,
		module: blog_exports
	},
	"routes/careers": {
		id: "routes/careers",
		parentId: "root",
		path: "careers",
		index: void 0,
		caseSensitive: void 0,
		module: careers_exports
	},
	"routes/contact": {
		id: "routes/contact",
		parentId: "root",
		path: "contact",
		index: void 0,
		caseSensitive: void 0,
		module: contact_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
