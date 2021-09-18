/*
 * @Author: HLianfa 
 * @Date: 2019-06-12 21:43:09 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-06-12 13:49:35
 */
// 涉及大量dom操作，考虑采用原生js实现
class DragSort {
    constructor(id) {
        this.initOption(id);
    }
    initOption(option) {
        this.node = document.getElementById(option);
        this.children = this.node.children;
        this.lastPosi = 0;
        this.liHeight = this.children[0].clientHeight; // 列表项高度
        this.initTop();
        this.addTouchListener();
    }
    // 初始化列表项样式
    initTop() {
        for (let index = 0; index < this.children.length; index++) {
            let child = this.children[index];
            child.setAttribute('style', `top:${index*this.liHeight}px`);
        }
    }
    moveHandler(liDom, tar, key, flag) {
        liDom.setAttribute('style', `top:${this.liHeight*(key-1)}px`);
        [liDom.dataset.number, tar.dataset.number] = [key, liDom.dataset.number];
        liDom.children[0].children[0].innerText = key;
        tar.children[0].children[0].innerText = key + flag;
    }
    // 向上移动
    preMove(liDom, tar, touchY, key) {
        if (liDom.dataset.number == (key - 1)) {
            if (touchY < (liDom.offsetTop + liDom.clientHeight / 2)) {
                this.moveHandler(liDom, tar, key, -1)
            }
        }
    }
    // 向下移动
    nextMove(liDom, tar, touchY, key) {
        if (liDom.dataset.number == (key + 1)) {
            if (touchY > (liDom.offsetTop - liDom.clientHeight / 2)) {
                this.moveHandler(liDom, tar, key, 1)
            }
        }
    }
    // 触摸事件
    addTouchListener() {
        //使用事件委托，将li的事件委托给ul
        this.node.ontouchstart = (event) => {
            event.preventDefault();
            let tar = event.target;
            if (tar.classList[0] === 'iconfont') {
                let tarParent = tar.parentNode;
                for (let index = 0; index < this.children.length; index++) {
                    let dom = this.children[index];
                    if (dom == tarParent) {
                        dom.classList.add('high-light');
                    } else {
                        dom.classList.add('select-mode');
                    }
                }
                tar.classList.replace('icontoggle', 'iconshangxiayidong');
                this.lastPosi = event.changedTouches[0].clientY;
            }
        }
        this.node.ontouchmove = (event) => {
            event.preventDefault();
            let touchY = event.changedTouches[0].clientY;
            let tar = event.target;
            let tarParent = tar.parentNode;
            let key = parseInt(tarParent.dataset.number);
            if (tar.classList[0] === 'iconfont' && touchY < this.liHeight * 3 && touchY > 0) {
                for (let j = 0; j < this.children.length; j++) {
                    let liDom = this.children[j];
                    if (this.lastPosi < touchY) {
                        this.nextMove(liDom, tarParent, touchY, key)
                    } else {
                        this.preMove(liDom, tarParent, touchY, key)
                    }
                }
                tarParent.setAttribute('style', `top:${touchY}px`)
            }
        }
        this.node.ontouchend = (event) => {
            event.preventDefault();
            let tar = event.target;
            if (tar.classList[0] === 'iconfont') {
                for (let index = 0; index < this.children.length; index++) {
                    let dom = this.children[index];
                    dom.classList.remove('high-light');
                    dom.classList.remove('select-mode');
                }
                tar.classList.replace('iconshangxiayidong', 'icontoggle');
                tar.parentNode.setAttribute('style',
                `top:${this.liHeight * (tar.parentNode.dataset.number - 1)}px`);
            }
        }
    }
}
window.DragSort = DragSort;