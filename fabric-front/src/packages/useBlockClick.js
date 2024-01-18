import { events } from './events';

export function useBlockClick(focusData, lastSelectBlock, data) {
    const handleClick = (events, block) => {
        // 处理点击事件的逻辑
        console.log('Block clicked:', block);
    }
    return {
        handleClick,
    };
}