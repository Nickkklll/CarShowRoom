// ─────────────────────────────────────────────
//  Утилиты
// ─────────────────────────────────────────────

function raf2(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

// ─────────────────────────────────────────────
//  flyToDetail
// ─────────────────────────────────────────────

export function flyToDetail(car, setSelectedCar) {
  document.querySelectorAll(".clone, .picture-block-clone, .clone-overlay").forEach(el => el.remove());

  const imgEl = document.querySelector(`[data-car-id="${car.id}"] img`);
  const divEl = document.querySelector(`[data-car-id="${car.id}"] .picture__block`);
  if (!imgEl) return setSelectedCar(car);

  const sourceImgRect = imgEl.getBoundingClientRect();
  const sourceDivRect = divEl ? divEl.getBoundingClientRect() : sourceImgRect;

  // ── Клон картинки ──
  const clone = document.createElement("img");
  clone.classList.add("clone");
  clone.src = imgEl.src;
  Object.assign(clone.style, {
    position:       "fixed",
    top:            sourceImgRect.top    + "px",
    left:           sourceImgRect.left   + "px",
    width:          sourceImgRect.width  + "px",
    height:         sourceImgRect.height + "px",
    objectFit:      "cover",
    objectPosition: "100% 27%",
    borderRadius:   "16px 16px 0 0",
    zIndex:         "9999",
    transition:     "none",
    pointerEvents:  "none",
    margin:         "0",
  });

  // ── Клон фона (showroom) ──
  // const cloneArea = document.createElement("div");
  // cloneArea.classList.add("picture-block-clone");
  // Object.assign(cloneArea.style, {
  //   position:           "fixed",
  //   top:                sourceDivRect.top    + "px",
  //   left:               sourceDivRect.left   + "px",
  //   width:              sourceDivRect.width  + "px",
  //   height:             sourceDivRect.height + "px",
  //   borderRadius:       "16px 0px",
  //   backgroundImage:    "url(/src/assets/images/showroom.webp)",
  //   backgroundSize:     "cover",
  //   backgroundPosition: "50% 50%",
  //   backgroundRepeat:   "no-repeat",
  //   zIndex:             "5",
  //   transition:         "none",
  //   margin:             "0",
  // });

  // ── Затемнювальний оверлей поверх фону ──
  // const cloneOverlay = document.createElement("div");
  // cloneOverlay.classList.add("clone-overlay");
  // Object.assign(cloneOverlay.style, {
  //   position:        "fixed",
  //   inset:           "0",
  //   background:      "rgba(0,0,0,0.2)",
  //   zIndex:          "6",      // між cloneArea(5) і clone(9999)
  //   pointerEvents:   "none",
  //   transition:      "none",
  // });

  // document.body.appendChild(cloneArea);
  // document.body.appendChild(cloneOverlay);
  document.body.appendChild(clone);

  imgEl.style.visibility = "hidden";

  // ── Анімуємо відхід карток, header і т.д. ──
  const header      = document.querySelector("header");
  const main        = document.querySelector("main");
  const mainWrapper = document.querySelector(".main-wrapper");

  raf2(() => {
    document.documentElement.style.setProperty("--overlay-bg", "rgba(0,0,0,0.2)");

    if (mainWrapper) {
      mainWrapper.style.transition = "opacity 0.1s ease, transform 0.1s ease-in-out, visibility 0.1s";
      mainWrapper.style.opacity    = "0";
      mainWrapper.style.visibility = "hidden";
      mainWrapper.style.transform  = "translateY(-115%)";
    }
    if (header) {
      header.style.transition = "opacity 0.4s ease, margin-top 0.4s ease-in-out";
      header.style.opacity    = "0";
      header.style.marginTop  = "-90px";
    }
    if (main) {
      main.style.transition = "margin-top 0.4s ease-in-out";
      main.style.marginTop  = "-90px";
    }
  });

  setSelectedCar(car);

  waitForElement(".car-detail__slider", 1200).then(sliderEl => {
    // ← Ключове виправлення зміщення:
    // Скролимо у верх і чекаємо reflow, щоб rect був без offset прокрутки
    window.scrollTo(0, 0);
    void sliderEl.offsetHeight; // примусовий reflow

    const targetRect = sliderEl.getBoundingClientRect();
    const TRANSITION = "all 0.4s ease-in-out";
    let bp=28;
    if(window.innerWidth<=1499){
      bp=10;
    } 
    if(window.innerWidth<=1040){
      bp=110;
    } 
    if(window.innerWidth<=560){
      bp=90;
    } 
    raf2(() => {
      clone.style.transition   = TRANSITION;
      clone.style.top          = (targetRect.top - bp)    + "px";
      clone.style.left         = targetRect.left   + "px";
      clone.style.width        = targetRect.width  + "px";
      clone.style.height       = targetRect.height + "px";
      clone.style.borderRadius = "16px 16px 0 0";

      
    });

    setTimeout(() => {
     
      sliderEl.style.transition = "opacity 0.3s ease";
    sliderEl.style.opacity    = "1";
      setTimeout(() => {
        
        
    clone.remove();
        
      }, 500);

      if (main) main.style.marginTop = "0px";
    }, 400);
  });
}



export function flyBack(car, onBack) {
  const sliderEl = document.querySelector(".car-detail__slider");
  const sliderRect = sliderEl ? sliderEl.getBoundingClientRect() : null;


  onBack();

  setTimeout(() => {
   
    document.querySelectorAll(".clone, .picture-block-clone, .clone-overlay").forEach(el => el.remove());

    waitForElement(`[data-car-id="${car.id}"] img`, 1500).then(targetImg => {
      const targetDivEl = document.querySelector(`[data-car-id="${car.id}"] .picture__block`);

      if (!sliderRect) {
        targetImg.style.visibility = "visible";
        _restoreUI();
        return;
      }


      const clone = document.createElement("img");
      clone.classList.add("clone");
      clone.src = targetImg.src;
      Object.assign(clone.style, {
        position: "fixed",
        top: sliderRect.top + "px",
        left: sliderRect.left + "px",
        width: sliderRect.width + "px",
        height: sliderRect.height + "px",
        objectFit: "cover",
        objectPosition: "100% 27%",
        borderRadius: "0px",
        zIndex: "9999",
        transition: "none",
        pointerEvents: "none",
        opacity: "1",
      });

      
      document.body.appendChild(clone);

     
      _restoreUI();

      
      setTimeout(() => {
        
        void targetImg.offsetHeight; 
        
        const finalImgRect = targetImg.getBoundingClientRect();
        const finalDivRect = targetDivEl ? targetDivEl.getBoundingClientRect() : finalImgRect;

        
        if (finalImgRect.height === 0) {
            targetImg.style.visibility = "visible";
            clone.remove();
            
            return;
        }

        const TRANSITION = "all 0.8s ease-in-out";

        raf2(() => {
          clone.style.transition = TRANSITION;
          clone.style.top = (finalImgRect.top + 78) + "px";
          clone.style.left = finalImgRect.left + "px";
          clone.style.width = finalImgRect.width + "px";
          clone.style.height = finalImgRect.height + "px";
          clone.style.borderRadius = "16px 16px 0 0";

         
          
        });

        setTimeout(() => {
          
          targetImg.style.visibility = "visible";
      //    
          clone.style.opacity = "0";
         
          setTimeout(() => {
            clone.remove();
            
          }, 100);
        }, 820);
      }, 50); 
    }).catch(() => {
      _restoreUI();
    });
  }, 30);
}

function _restoreUI() {
  const mainWrapper = document.querySelector(".main-wrapper");
  const header      = document.querySelector("header");
  const main        = document.querySelector("main");

  document.documentElement.style.setProperty("--overlay-bg", "rgba(0,0,0,0.8)");

  if (mainWrapper) {
    mainWrapper.style.transition    = "opacity 0.8s ease-in-out, visibility 0.8s, transform 0.8s ease-in-out";
    mainWrapper.style.opacity       = "1";
    mainWrapper.style.visibility    = "visible";
    mainWrapper.style.transform     = "translateY(0%)";
    mainWrapper.style.pointerEvents = "";
  }
  if (header) {
    header.style.transition = "opacity 0.8s ease-in-out, margin-top 0.8s ease-in-out";
    header.style.opacity    = "1";
    header.style.marginTop  = "0px";
  }
  if (main) {
    main.style.transition = "margin-top 0.8s ease-in-out";
    main.style.marginTop  = "0px";
  }
}





function waitForElement(selector, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`waitForElement: "${selector}" не з'явився за ${timeout}ms`));
    }, timeout);
  });
}


