import {chromium} from 'playwright';
export {chromium};
export const serviceNames=['Sửa Lắp Máy Nước Nóng Lạnh Tắm','Sửa Lắp Máy Nước Uống Nóng Lạnh','Sửa Chữa Điện Nước','Vệ Sinh Máy Giặt','Sửa Máy Giặt','Sửa Tủ Lạnh','Nạp Gas Máy Lạnh','Sửa Máy Lạnh','Vệ Sinh Máy Lạnh','Tháo Lắp Máy Lạnh'];
export function services(){return serviceNames.map((name,i)=>({id:`service-${i}`,name,slug:`dich-vu-${i}`,summary:'Thông tin dịch vụ kiểm thử',description:'Mô tả đầy đủ của bản ghi kiểm thử.',imageUrl:'/images/redesign/sua-may-lanh-realism-v2-uniform-v1.webp',imageAlt:name,isActive:true,displayOrder:9-i,updatedAt:'2026-10-05T07:47:46Z'}))}
export async function context(browser,width,{populated=false,height=844}={}){
 const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',isMobile:width<1024,hasTouch:width<1024});
 // A dummy token is confined to this disposable local browser. No real credentials/API calls.
 await c.addInitScript(()=>localStorage.setItem('accessToken','local-ui-fixture-not-a-real-token'));
 const records=services();const calls=[];
 await c.route('**/api/**',async route=>{const q=route.request(),url=new URL(q.url()),path=url.pathname.replace(/^\/api/,'');calls.push({method:q.method(),path,body:q.postData()});let body=[];
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date());
  const bookings=populated?[{id:'booking-fixture-1',scheduledDate:today,customerName:'Khách kiểm thử 01',customerPhone:'0900000001',address:'Địa chỉ kiểm thử, Cần Thơ',notes:'Ghi chú kiểm thử',status:'PENDING',service:{name:'Sửa máy lạnh'},location:{name:'Ninh Kiều'}},{id:'booking-fixture-2',scheduledDate:today,customerName:'Khách kiểm thử 02',customerPhone:'0900000002',address:'Địa chỉ kiểm thử thứ hai',status:'CONFIRMED',service:{name:'Sửa máy giặt'},location:{name:'Cái Răng'}}]:[];
  if(path==='/admin/dashboard')body={services:records.length,bookings:bookings.length,blog:0,categories:0,faqs:0,bookingOverview:{todayActive:bookings.length,upcoming7DaysActive:bookings.length,pendingActive:populated?1:0,nextBookingDate:populated?today:null,nextBookingCount:bookings.length}};
  else if(path==='/bookings/schedule')body={from:url.searchParams.get('from'),to:url.searchParams.get('to'),days:populated?[{date:today,activeCount:2,cancelledCount:0,statusCounts:{PENDING:1,CONFIRMED:1,IN_PROGRESS:0,COMPLETED:0,CANCELLED:0}}]:[],bookings};
  else if(path==='/admin/services'&&q.method()==='GET')body={items:records,total:records.length};
  else if(path.startsWith('/admin/services/')&&q.method()==='DELETE'){const index=records.findIndex(x=>x.id===path.split('/').at(-1));if(index>=0)records.splice(index,1);body={success:true}};
  if(path.startsWith('/admin/services/')&&q.method()==='PATCH'){const record=records.find(x=>x.id===path.split('/').at(-1));if(record)Object.assign(record,JSON.parse(q.postData()||'{}'));body=record||{}}
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
 });
 return {c,calls,records};
}
