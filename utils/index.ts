export const log = console.log;
export const { format: formatNumber } = Intl.NumberFormat("en-GB", {
	notation: "compact",
	maximumFractionDigits: 1,
});

/**
 * 识别给定图像的主题颜色，返回 RGBA 值的平均值。
 *
 * @param imgUrl 要识别的图像的 URL。
 * @returns 包含 RGBA 值平均值的数组，顺序为 [R, G, B, A]。
 */
export async function identifySubject(imgUrl: string): Promise<[number, number, number, number]> {
	// const blob = await fetch(imgUrl, { cache: "no-cache" }).then(data => data.blob());
	// const src = URL.createObjectURL(blob);
	return new Promise(resolve => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;
		const img = new Image();
		img.onload = () => {
			canvas.width = img.height;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const { data } = ctx.getImageData(0, 0, img.width, img.height);
			const rgbas: [number, number, number, number][] = [];
			for (let i = 0; i < data.length; i += 4) rgbas.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
			const result: [number, number, number, number] = [0, 0, 0, 0];
			for (const [r, g, b, a] of rgbas) {
				result[0] += r;
				result[1] += g;
				result[2] += b;
				result[3] += a;
			}
			result[0] /= rgbas.length;
			result[1] /= rgbas.length;
			result[2] /= rgbas.length;
			result[3] = result[3] / rgbas.length / 255;
			resolve(result);
		};
		// img.onended = () => URL.revokeObjectURL(src);
		img.crossOrigin = "";
		img.src = imgUrl;

		// img.setAttribute("crossOrigin", "Anonymous");
	});
}

export const toFileUrl = (id: string) => `/api/file/${id}`;

export const resolveArticleTitles = <T extends Element>(doc: T) => {
	interface Title {
		el: HTMLElement;
		children: Title[];
	}

	const titles: Title[] = [];

	doc.childNodes.forEach(e => {
		if (/h\d/i.test(e.nodeName)) {
			titles.push({
				el: e as HTMLElement,
				children: [],
			});
		}
	});

	const r = (list: Title[]) => {
		const result: Title[] = [];
		const min = Math.min(...list.map(item => +item.el.nodeName.slice(1)));
		for (const item of list.filter(item => +item.el.nodeName.slice(1) === min)) {
			const start = list.indexOf(item) + 1;
			const end = list.slice(start).findIndex(sub => sub.el.nodeName == item.el.nodeName);
			result.push({
				el: item.el,
				children: r(list.slice(start, end == -1 ? list.length : end)),
			});
		}
		return result;
	};

	return r(titles);
};
