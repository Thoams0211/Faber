import { events } from './events';
export function useMenuDragger(containerRef, data) {
    let currentComponent = null;
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = 'move'; // h5拖动的图标
    }
    const dragover = (e) => {
        e.preventDefault();
    }
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = 'none';
    }
    const drop = (e) => {
        // 先留在这
        let blocks = data.value.blocks; // 内部已经渲染的组件
        data.value = {
            ...data.value, blocks: [
                ...blocks,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    zIndex: 1,
                    key: currentComponent.key,
                    alignCenter: true // 希望松手的时候你可以居中
                }
            ]
        }
        currentComponent = null;

        try {
            // Customize the URL to match your Python script
            const url = 'http://localhost:5000'; // Send to the root endpoint
            // Customize the data you want to send
            const data = { message: 'Drag' };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // 请求成功，处理响应
                        const responseData = JSON.parse(xhr.responseText);
                        console.log('Backend response:', responseData);
                    } else {
                        // 请求失败或其他状态
                        console.error('Error or unexpected state:', xhr.status);
                    }
                }
            };

            // Convert the data object to a JSON string before sending
            xhr.send(JSON.stringify(data));
        } catch (error) {
            console.error('Error sending POST request:', error);
        }
    }
    const dragstart = (e, component) => {
        // dragenter进入元素中 添加一个移动的标识
        // dragover 在目标元素经过 必须要阻止默认行为 否则不能触发drop
        // dragleave 离开元素的时候 需要增加一个禁用标识
        // drop 松手的时候 根据拖拽的组件 添加一个组件
        containerRef.value.addEventListener('dragenter', dragenter)
        containerRef.value.addEventListener('dragover', dragover)
        containerRef.value.addEventListener('dragleave', dragleave)
        containerRef.value.addEventListener('drop', drop)
        // try {
        //     // Customize the URL to match your Python script
        //     const url = 'http://localhost:5000'; // Send to the root endpoint
        //     // Customize the data you want to send
        //     const data = { message: 'Drag ended, sending message to backend...' };

        //     const xhr = new XMLHttpRequest();
        //     xhr.open('POST', url, true);
        //     xhr.setRequestHeader('Content-Type', 'application/json');

        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState === 4 && xhr.status === 200) {
        //             // Handle the response if needed
        //             const responseData = JSON.parse(xhr.responseText);
        //             console.log('Backend response:', responseData);
        //         } else {
        //             // Handle errors or other states
        //             console.error('Error or unexpected state:', xhr.status);
        //         }
        //     };

        //     // Convert the data object to a JSON string before sending
        //     xhr.send(JSON.stringify(data));
        // } catch (error) {
        //     console.error('Error sending POST request:', error);
        // }
        currentComponent = component
        events.emit('start'); // 发布start
    }
    const dragend = (e) => {
        containerRef.value.removeEventListener('dragenter', dragenter)
        containerRef.value.removeEventListener('dragover', dragover)
        containerRef.value.removeEventListener('dragleave', dragleave)
        containerRef.value.removeEventListener('drop', drop)
        events.emit('end'); // 发布end
    }
    return {
        dragstart,
        dragend
    }
}
