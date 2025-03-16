export class TPSlider extends HTMLElement {
    private slides: HTMLElement[];
    private currentIndex: number;
    private autoPlayInterval: number | null;
    private slidesPerView: number;
    private dotsContainer!: HTMLDivElement;

    constructor() {
        super();
        this.slides = [];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.slidesPerView = 1;
        this.init();
    }

    // Initialize Component
    private init(): void {
        this.setupSlides();
        if (this.hasAttribute("arrows")) this.addArrows();
        if (this.hasAttribute("dots")) this.addDots();
        if (this.hasAttribute("infinite")) this.addClones();
        if (this.hasAttribute("auto-play")) this.startAutoPlay();
    }

    // Setup Slides & Scroll
    private setupSlides(): void {
        this.slides = [...this.querySelectorAll("tp-slide")] as HTMLElement[];
        this.slidesPerView = parseInt(this.getAttribute("slides-per-view") || "1");
        this.style.overflowX = "auto";
        this.slides.forEach((slide) => {
            slide.style.flex = `0 0 calc(100% / ${this.slidesPerView} - 10px)`;
            slide.style.scrollSnapAlign = "start";
        });
    }

    // Next/Previous Methods
    public next(): void {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.scrollToSlide(this.currentIndex);
    }

    public prev(): void {
        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.scrollToSlide(this.currentIndex);
    }

    // Scroll to Specific Slide
    public scrollToSlide(index: number): void {
        const slideWidth = this.slides[0].offsetWidth + 10; // Include gap
        this.scrollTo({
            left: slideWidth * index,
            behavior: "smooth",
        });
        this.updateDots(index);
    }

    // Pagination Dots
    private addDots(): void {
        this.dotsContainer = document.createElement("div");
        this.dotsContainer.className = "tp-dots";
        this.slides.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.className = `tp-dot ${i === 0 ? "active" : ""}`;
            dot.addEventListener("click", () => this.scrollToSlide(i));
            this.dotsContainer.appendChild(dot);
        });
        this.appendChild(this.dotsContainer);
    }

    // Update Active Dot
    private updateDots(activeIndex: number): void {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll(".tp-dot");
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
        });
    }

    // Infinite Scroll (Clone First/Last Slides)
    private addClones(): void {
        const firstClone = this.slides[0].cloneNode(true) as HTMLElement;
        const lastClone = this.slides[this.slides.length - 1].cloneNode(true) as HTMLElement;
        firstClone.classList.add("clone");
        lastClone.classList.add("clone");
        this.append(firstClone);
        this.prepend(lastClone);
    }

    // Auto-Play
    private startAutoPlay(): void {
        const delay = parseInt(this.getAttribute("auto-play") || "3000");
        this.autoPlayInterval = window.setInterval(() => this.next(), delay);
        
        this.addEventListener("mouseenter", () => {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        });
        
        this.addEventListener("mouseleave", () => {
            if (!this.autoPlayInterval) {
                this.startAutoPlay();
            }
        });
    }

    // Arrows
    private addArrows(): void {
        const prevArrow = document.createElement("div");
        prevArrow.className = "tp-arrow prev";
        prevArrow.innerHTML = "❮";
        prevArrow.addEventListener("click", () => this.prev());

        const nextArrow = document.createElement("div");
        nextArrow.className = "tp-arrow next";
        nextArrow.innerHTML = "❯";
        nextArrow.addEventListener("click", () => this.next());

        this.appendChild(prevArrow);
        this.appendChild(nextArrow);
    }
}

