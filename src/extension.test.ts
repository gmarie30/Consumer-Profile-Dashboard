import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
function setup(){let listener:any;const sent:any[]=[];let reads=0,revoked=0;const chrome={runtime:{id:'test',getURL:(p:string)=>'chrome-extension://test/'+p,onMessage:{addListener:(fn:any)=>listener=fn}},action:{openPopup:async()=>{}},permissions:{contains:async()=>true,remove:async()=>{revoked++;return true}},history:{search:async()=>{reads++;return [{url:'https://example.test/camera?token=secret',title:'Camera'}]},getVisits:async()=>[{visitTime:Date.now()-1000}]},tabs:{sendMessage:async(...args:any[])=>{sent.push(args)}}};vm.runInNewContext(fs.readFileSync(new URL('../extension/service-worker.js',import.meta.url),'utf8'),{chrome,URL,Date,console});return {send:(m:any,s:any)=>new Promise<any>(resolve=>listener(m,s,resolve)),sent,reads:()=>reads,revoked:()=>revoked}}
const sender={frameId:0,tab:{id:5,url:'https://gmarie30.github.io/Consumer-Profile-Dashboard/'},url:'https://gmarie30.github.io/Consumer-Profile-Dashboard/'};
const popup={id:'test',url:'chrome-extension://test/popup.html'};
const request={type:'CIL_HISTORY_QUERY',days:30,requestId:'12345678-1234-1234-1234-123456789abc'};
describe('extension security and consent (mocked Chrome APIs)',()=>{
 it('rejects other origins and subframes',async()=>{const s=setup();expect((await s.send(request,{...sender,url:'https://evil.test/'})).ok).toBe(false);expect((await s.send(request,{...sender,frameId:1})).ok).toBe(false);expect(s.reads()).toBe(0)});
 it('does not read history until popup explicitly approves',async()=>{const s=setup();expect((await s.send(request,sender)).pending).toBe(true);expect(s.reads()).toBe(0);expect((await s.send({type:'CIL_APPROVE'},popup)).ok).toBe(true);expect(s.reads()).toBe(1);expect(s.sent[0][0]).toBe(5);expect(s.sent[0][1].records[0].url).toBe('https://example.test/camera');expect(s.sent[0][1].requestId).toBe(request.requestId)});
 it('rejects approvals from web content',async()=>{const s=setup();await s.send(request,sender);expect((await s.send({type:'CIL_APPROVE'},sender)).ok).toBe(false);expect(s.reads()).toBe(0)});
 it('revokes permission and cancels pending requests',async()=>{const s=setup();await s.send(request,sender);expect((await s.send({type:'CIL_DISCONNECT'},sender)).ok).toBe(true);expect(s.revoked()).toBe(1);expect((await s.send({type:'CIL_APPROVE'},popup)).ok).toBe(false);expect(s.reads()).toBe(0)});
 it('does not request credentials or broad host permissions',()=>{const m=JSON.parse(fs.readFileSync(new URL('../extension/manifest.json',import.meta.url),'utf8'));expect(m.optional_permissions).toEqual(['history']);expect(m.permissions).toBeUndefined();expect(m.host_permissions).toBeUndefined();expect(m.content_scripts[0].matches).not.toContain('<all_urls>')});
});
