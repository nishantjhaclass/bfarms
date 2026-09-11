const DEFAULTS={small:16,medium:18,large:21,delivery:30};
const icons={small:"🥚",medium:"🥚",large:"🍳"};
const names={small:"Small",medium:"Medium",large:"Large"};
const rates=()=>JSON.parse(localStorage.getItem("eggRates")||JSON.stringify(DEFAULTS));
let state={size:"medium",qty:12};

function money(n){return "Rs. "+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});}
function dateText(){return new Date().toLocaleDateString("en-NP",{year:"numeric",month:"long",day:"numeric"});}
document.getElementById("today").textContent=dateText();

function renderProducts(){
 const r=rates();
 document.getElementById("productGrid").innerHTML=["small","medium","large"].map((s,i)=>`
 <article class="product ${state.size===s?"selected":""}" data-size="${s}">
   <div class="product-top"><div class="product-icon">${icons[s]}</div><span class="badge">${s==="medium"?"POPULAR":"FRESH"}</span></div>
   <h3>${names[s]} eggs</h3><p>${s==="small"?"Everyday value":s==="medium"?"Balanced family size":"Large premium eggs"}</p>
   <span class="price">${money(r[s])}</span><span class="per"> / egg</span>
 </article>`).join("");
 document.querySelectorAll(".product").forEach(el=>el.onclick=()=>{state.size=el.dataset.size;renderProducts();updateSummary();});
 document.getElementById("heroPrice").textContent=money(r.medium);
 document.getElementById("selectedIcon").textContent=icons[state.size];
 document.getElementById("selectedName").textContent=names[state.size];
 document.getElementById("selectedPrice").textContent=money(r[state.size]);
}
function updateSummary(){
 const r=rates(), qty=Math.max(0,Number(document.getElementById("quantity").value||0));
 const sub=r[state.size]*qty;
 const fee=sub>0?r.delivery:0;
 document.getElementById("subtotal").textContent=money(sub);
 document.getElementById("deliveryFee").textContent=money(fee);
 document.getElementById("total").textContent=money(sub+fee);
 document.getElementById("selectedIcon").textContent=icons[state.size];
 document.getElementById("selectedName").textContent=names[state.size];
 document.getElementById("selectedPrice").textContent=money(r[state.size]);
}
function validMadheshDistrict(d){return ["Saptari","Siraha","Dhanusha","Mahottari","Sarlahi","Rautahat","Bara","Parsa"].includes(d);}

document.getElementById("minus").onclick=()=>{let q=Number(quantity.value);quantity.value=Math.max(6,q-6);updateSummary();}
document.getElementById("plus").onclick=()=>{quantity.value=Number(quantity.value)+6;updateSummary();}
document.getElementById("quantity").oninput=updateSummary;
document.querySelectorAll('input[name="delivery"]').forEach(x=>x.onchange=()=>document.querySelectorAll(".choice").forEach(c=>c.classList.toggle("active",c.querySelector("input").checked)));

document.getElementById("orderForm").onsubmit=e=>{
 e.preventDefault();
 const error=document.getElementById("formError"); error.classList.add("hidden");
 const district=document.getElementById("district").value, q=Number(quantity.value), phone=document.getElementById("phone").value.trim();
 if(!validMadheshDistrict(district)){error.textContent="Please choose one of the 8 Madhesh Province districts.";error.classList.remove("hidden");return;}
 if(q<6||q%6!==0){error.textContent="Quantity must be 6 or a multiple of 6.";error.classList.remove("hidden");return;}
 if(!/^(97|98)\d{8}$/.test(phone)){error.textContent="Please enter a valid Nepal mobile number beginning with 97 or 98.";error.classList.remove("hidden");return;}
 const r=rates(), delivery=document.querySelector('input[name="delivery"]:checked').value;
 const order={id:"MF-"+Date.now().toString().slice(-8),name:name.value.trim(),phone,district,localLevel:localLevel.value.trim(),address:address.value.trim(),instagram:instagram.value.trim().replace(/^@/,""),size:state.size,quantity:q,total:r[state.size]*q+r.delivery,delivery,created:new Date().toISOString()};
 const orders=JSON.parse(localStorage.getItem("eggOrdersV2")||"[]");orders.unshift(order);localStorage.setItem("eggOrdersV2",JSON.stringify(orders));
 document.getElementById("successText").textContent=`${order.id} • ${q} ${names[state.size]} eggs • ${money(order.total)} • ${delivery==="next"?"Next day":"Within 3 days"}.`;
 document.getElementById("successModal").classList.remove("hidden");renderOrders();e.target.reset();quantity.value=12;state.size="medium";renderProducts();updateSummary();
};
function renderOrders(){
 const orders=JSON.parse(localStorage.getItem("eggOrdersV2")||"[]"), el=document.getElementById("ordersList");
 if(!orders.length){el.innerHTML='<div class="empty">No orders on this browser yet. Place your first egg order above. 🥚</div>';return;}
 el.innerHTML=orders.map(o=>`<div class="order-row"><div><b>${o.id}</b><br><small>${o.quantity} ${names[o.size]} eggs • ${o.district} • ${o.localLevel}</small></div><div><small>${new Date(o.created).toLocaleDateString("en-NP")}</small><br><small>${o.delivery==="next"?"Next day":"Within 3 days"}</small></div><span class="status">Received</span></div>`).join("");
}
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).classList.add("hidden"));
document.getElementById("creatorOpen").onclick=()=>document.getElementById("creatorModal").classList.remove("hidden");
document.getElementById("creatorLoginBtn").onclick=()=>{
 const pin=document.getElementById("creatorPin").value;
 if(pin!=="2580"){pinError.textContent="Incorrect demo PIN.";pinError.classList.remove("hidden");return;}
 creatorLogin.classList.add("hidden");creatorDash.classList.remove("hidden");loadAdmin();
};
function loadAdmin(){const r=rates();priceSmall.value=r.small;priceMedium.value=r.medium;priceLarge.value=r.large;priceDelivery.value=r.delivery;adminOrderCount.textContent=JSON.parse(localStorage.getItem("eggOrdersV2")||"[]").length;}
document.getElementById("savePrices").onclick=()=>{localStorage.setItem("eggRates",JSON.stringify({small:Number(priceSmall.value),medium:Number(priceMedium.value),large:Number(priceLarge.value),delivery:Number(priceDelivery.value)}));renderProducts();updateSummary();alert("Today's rates saved on this browser.");};
document.getElementById("resetPrices").onclick=()=>{localStorage.setItem("eggRates",JSON.stringify(DEFAULTS));loadAdmin();renderProducts();updateSummary();};
document.getElementById("creatorLogout").onclick=()=>{creatorDash.classList.add("hidden");creatorLogin.classList.remove("hidden");creatorPin.value="";};
document.getElementById("clearOrders").onclick=()=>{if(confirm("Clear all orders stored on this browser?")){localStorage.removeItem("eggOrdersV2");renderOrders();loadAdmin();}};
renderProducts();updateSummary();renderOrders();
