
import React from 'react';

const MarkdownRenderer = ({ content, className = '' }) => {
  // 마크다운을 HTML로 변환하는 함수
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // 줄바꿈을 <br />로 변환하되, 특수 패턴은 먼저 처리
    let html = text;
    
    // 코드 블록 보호 (```으로 둘러싸인 부분)
    const codeBlocks = [];
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      codeBlocks.push(`<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-sm"><code>${code}</code></pre>`);
      return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
    });
    
    // 헤더 처리
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mb-2 dark:text-gray-100">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-3 dark:text-gray-100">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 dark:text-gray-100">$1</h1>');
    
    // 리스트 처리
    html = html.replace(/^- (.+)$/gm, '<li class="list-disc ml-6 mb-1">$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="list-decimal ml-6 mb-1">$2</li>');
    
    // 인용문 처리
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4 text-gray-600 dark:text-gray-400">$1</blockquote>');
    
    // 수평선 처리
    html = html.replace(/^---+$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />');
    html = html.replace(/^\*\*\*+$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />');
    html = html.replace(/^___+$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />');
    
    // 연속된 리스트 아이템들을 ul/ol로 감싸기
    html = html.replace(/(<li class="list-disc.*?<\/li>\n?)+/g, (match) => {
      return `<ul class="list-disc pl-5 mb-4">${match}</ul>`;
    });
    html = html.replace(/(<li class="list-decimal.*?<\/li>\n?)+/g, (match) => {
      return `<ol class="list-decimal pl-5 mb-4">${match}</ol>`;
    });
    
    // 인라인 요소 처리
    html = html
      // 볼드
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // 이탤릭
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // 인라인 코드
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // 링크
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // 이미지
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
    
    // 코드 블록 복원
    html = html.replace(/___CODE_BLOCK_(\d+)___/g, (match, index) => codeBlocks[index]);
    
    // 줄바꿈 처리: 단일 줄바꿈을 <br />로 변환
    html = html.replace(/\n/g, '<br />');
    
    // 연속된 <br /> 정리 (2개 이상이면 문단 구분으로 처리)
    html = html.replace(/(<br \/>){3,}/g, '</p><p class="mb-4">');
    html = html.replace(/(<br \/>){2}/g, '</p><p class="mb-4">');
    
    // 시작과 끝에 p 태그 추가
    if (!html.startsWith('<')) {
      html = `<p class="mb-4">${html}</p>`;
    }
    
    return html;
  };

  return (
    <div 
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;