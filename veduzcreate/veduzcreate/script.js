var cart = JSON.parse(localStorage.getItem('veduzCart') || '[]');
var reviews = JSON.parse(localStorage.getItem('veduzReviews') || '[]');
var uploadedPhotoData = null;
var WHATSAPP_NUMBER = '917021478998';

function saveCart(){ localStorage.setItem('veduzCart', JSON.stringify(cart)); }
function saveReviews(){ localStorage.setItem('veduzReviews', JSON.stringify(reviews)); }

window.addEventListener('scroll', function(){
  var nav=document.getElementById('navbar');
  if(nav){ nav.classList.toggle('scrolled', window.scrollY>30); }
});

var hamburger=document.getElementById('hamburger');
var navMenu=document.getElementById('navMenu');
if(hamburger){ hamburger.addEventListener('click', function(){ navMenu.classList.toggle('active'); }); }

function searchBouquets(){
  var q=document.getElementById('searchInput').value.toLowerCase().trim();
  var cards=document.querySelectorAll('.product-card');
  var visible=0;
  for(var i=0;i<cards.length;i++){
    var card=cards[i];
    var txt=card.innerText.toLowerCase();
    if(txt.indexOf(q)!==-1){ card.style.display='flex'; visible++; } else { card.style.display='none'; }
  }
  var noRes=document.getElementById('noResult');
  if(!noRes){ noRes=document.createElement('div'); noRes.id='noResult'; noRes.style.cssText='grid-column:1/-1;text-align:center;padding:40px;color:#999;display:none'; noRes.innerHTML='No products found 🔍'; document.getElementById('productGrid').appendChild(noRes); }
  noRes.style.display=(visible===0&&q!=='')?'block':'none';
}

function addToCart(name,price,img){
  var found=null;
  for(var i=0;i<cart.length;i++){ if(cart[i].name===name){found=cart[i];break;} }
  if(found){ found.qty++; } else { cart.push({name:name,price:price,img:img,qty:1}); }
  saveCart(); updateCartUI(); showToast(name+' added 💗');
}
function removeCart(i){ cart.splice(i,1); saveCart(); updateCartUI(); }
function updateQty(i,d){ cart[i].qty+=d; if(cart[i].qty<=0){ removeCart(i); return; } saveCart(); updateCartUI(); }

function updateCartUI(){
  var countEl=document.getElementById('cartCount');
  var totalEl=document.getElementById('cartTotal');
  var itemsEl=document.getElementById('cartItems');
  var totalQty=0,totalPrice=0;
  for(var i=0;i<cart.length;i++){ totalQty+=cart[i].qty; totalPrice+=cart[i].price*cart[i].qty; }
  countEl.innerText=totalQty; totalEl.innerText='₹'+totalPrice;
  if(cart.length===0){
    itemsEl.innerHTML='<div class="empty-cart"><div style="font-size:48px">🛍️</div><h3>Your cart is empty</h3><p>Add something beautiful</p><a href="#bouquets" style="margin-top:12px;display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:100px;text-decoration:none">Explore Products →</a></div>';
    return;
  }
  var html='';
  for(var j=0;j<cart.length;j++){
    var c=cart[j];
    html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #f0f0f0"><div style="display:flex;gap:12px;align-items:center"><img src="'+c.img+'" style="width:56px;height:56px;border-radius:12px;object-fit:cover"><div><strong style="font-size:14px">'+c.name+'</strong><br><small>₹'+c.price+' x '+c.qty+'</small></div></div><div><button onclick="updateQty('+j+',-1)" style="width:28px;height:28px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer">-</button> '+c.qty+' <button onclick="updateQty('+j+',1)" style="width:28px;height:28px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer">+</button> <button onclick="removeCart('+j+')" style="border:none;background:none;cursor:pointer;margin-left:6px">✕</button></div></div>';
  }
  itemsEl.innerHTML=html;
}
updateCartUI();

function showToast(msg){
  var t=document.getElementById('toast');
  t.innerText=msg; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('show'); },2600);
}

function orderWhatsApp(){
  if(cart.length===0){ showToast('Cart empty 🛍️'); return; }
  var name=document.getElementById('customerName').value.trim();
  var phone=document.getElementById('customerPhone').value.trim();
  var addr=document.getElementById('customerAddress').value.trim();
  var payment=document.querySelector('input[name="payment"]:checked').value;
  if(!name||!phone||!addr){ showToast('Fill Name, Phone & Address 💌'); return; }
  var total=0, text='';
  for(var i=0;i<cart.length;i++){ total+=cart[i].price*cart[i].qty; text+='• '+cart[i].name+' x'+cart[i].qty+' - ₹'+cart[i].price*cart[i].qty+'%0A'; }
  var msg='Hi Veduz Creates 🌸%0A%0ANew Order:%0A'+text+'%0ATotal: ₹'+total+'%0APayment: '+payment+'%0AName: '+name+'%0APhone: '+phone+'%0AAddress: '+addr;
  window.open('https://wa.me/'+WHATSAPP_NUMBER+'?text='+msg,'_blank');
}

var reviewsContainer=document.getElementById('reviewsContainer');
var reviewCountEl=document.getElementById('reviewCount');
function renderReviews(){
  if(!reviewsContainer) return;
  reviewCountEl.innerText=reviews.length;
  if(reviews.length===0){
    reviewsContainer.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;background:#fff;border-radius:20px;border:1px dashed #ddd"><div style="font-size:40px">💌</div><h3>No reviews yet</h3><p style="color:#888;font-size:13px">Be first to share your love 🌸<br>Real reviews only</p></div>';
    return;
  }
  var html='';
  for(var i=0;i<reviews.length;i++){
    var r=reviews[i];
    var stars=''; for(var s=0;s<r.rating;s++) stars+='⭐';
    var photo=r.photo?'<img src="'+r.photo+'" style="width:100%;height:150px;object-fit:cover;border-radius:12px;margin-bottom:10px">':'';
    html+='<div style="background:#fff;padding:20px;border-radius:18px;box-shadow:0 5px 20px rgba(0,0,0,0.04);border:1px solid #f3f4f6"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><div style="display:flex;gap:10px;align-items:center"><div style="width:38px;height:38px;border-radius:50%;background:#ffe0ec;display:flex;align-items:center;justify-content:center;font-weight:700;color:#ff6b9d">'+r.name.charAt(0).toUpperCase()+'</div><div><strong style="font-size:13px">'+r.name+'</strong><br><small style="color:#999;font-size:11px">'+r.date+'</small></div></div><div style="font-size:12px">'+stars+'</div></div>'+photo+'<p style="font-size:13px;color:#555">'+r.comment+'</p></div>';
  }
  reviewsContainer.innerHTML=html;
}
renderReviews();

var photoInput=document.getElementById('reviewPhoto');
var photoPreview=document.getElementById('photoPreview');
var chooseBtn=document.getElementById('choosePhoto');
var uploadContent=document.getElementById('uploadContent');
var photoUpload=document.getElementById('photoUpload');
var removePhotoBtn=document.getElementById('removePhoto');

if(chooseBtn){ chooseBtn.addEventListener('click', function(e){ e.preventDefault(); photoInput.click(); }); }
if(photoUpload){ photoUpload.addEventListener('click', function(){ photoInput.click(); }); }
if(photoInput){
  photoInput.addEventListener('change', function(){
    var file=photoInput.files[0]; if(!file) return;
    if(file.size>2*1024*1024){ showToast('Max 2MB'); return; }
    var reader=new FileReader();
    reader.onload=function(e){
      uploadedPhotoData=e.target.result;
      photoPreview.src=uploadedPhotoData; photoPreview.style.display='block';
      uploadContent.style.display='none'; removePhotoBtn.style.display='block';
    };
    reader.readAsDataURL(file);
  });
}
if(removePhotoBtn){
  removePhotoBtn.addEventListener('click', function(e){
    e.stopPropagation(); uploadedPhotoData=null; photoPreview.style.display='none'; uploadContent.style.display='block'; this.style.display='none'; photoInput.value='';
  });
}

var reviewForm=document.getElementById('reviewForm');
if(reviewForm){
  reviewForm.addEventListener('submit', function(e){
    e.preventDefault();
    var name=document.getElementById('reviewName').value.trim();
    var rating=parseInt(document.getElementById('reviewRating').value);
    var comment=document.getElementById('reviewComment').value.trim();
    var msgEl=document.getElementById('reviewMessage');
    if(!name||!rating||!comment){ msgEl.innerText='Fill all fields'; msgEl.style.color='red'; return; }
    var newReview={id:Date.now(),name:name,rating:rating,comment:comment,photo:uploadedPhotoData||'',date:new Date().toLocaleDateString()};
    reviews.unshift(newReview); saveReviews(); renderReviews();
    reviewForm.reset(); uploadedPhotoData=null; photoPreview.style.display='none'; uploadContent.style.display='block'; removePhotoBtn.style.display='none';
    msgEl.innerText='Thank you! Real review added 💗'; msgEl.style.color='green';
    setTimeout(function(){ msgEl.innerText=''; },3000);
  });
}