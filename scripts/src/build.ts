import { CSSBuilder, TSBuilder } from "./server/builder";
import {
  srcEntry,
  srcOutfile,
  extensionEntry,
  extensionOutfile,
  extensionBackground,
  extensionBackgroundOutfile,
  extensionContent,
  extensionContentOutfile,
} from "./env";

CSSBuilder(true);

TSBuilder(srcEntry, srcOutfile, true);
TSBuilder(extensionEntry, extensionOutfile, true);
TSBuilder(extensionBackground, extensionBackgroundOutfile, true);
TSBuilder(extensionContent, extensionContentOutfile, true);
