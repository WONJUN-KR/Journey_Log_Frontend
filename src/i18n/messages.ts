import type { Lang } from "./config";
import { ko, type Messages } from "./locales/ko";

// 언어별 메시지 묶음 - request.ts(컴포넌트) · translator.ts(메타데이터) 가 같이 씀
export const MESSAGES: Record<Lang, Messages> = { ko };
