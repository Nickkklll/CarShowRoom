const url = "https://dummyjson.com/products/category/vehicle";

export async function getCarList() {
  const res = await fetch(url);
  const data = await res.json();
  return data.products;
}
setTimeout(() => {
  const openBtn = document.querySelector(".open__filter-btn");
  openBtn.addEventListener("click", () => {
    const filters = document.querySelector(".filter__burger");
    if(filters.classList.contains('isOpen'))return;
    filters.classList.toggle("isOpen");
    

    const closeBtn= filters.querySelector('.close__btn');
    closeBtn.addEventListener('click',()=>{
      filters.classList.remove('isOpen');
    })
  });
}, 100);


