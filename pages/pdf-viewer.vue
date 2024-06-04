<template>
  <UContainer class="w-full space-y-4">
    <div class="flex justify-center">
      <span
        class="text-center text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text"
      >
        {{ pdfUrl.substring(pdfUrl.lastIndexOf("/") + 1) }}</span
      >
    </div>
    <canvas id="the-canvas" class="mx-auto"></canvas>
    <UPagination
      v-if="pdfPageCount > 0"
      v-model="pdfPage"
      class="mx-auto max-w-fit"
      :total="pdfPageCount"
      :page-count="pageCount"
    />
  </UContainer>
</template>

<script setup lang="ts">
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
const { query } = useRoute();

GlobalWorkerOptions.workerSrc =
  "https://cdn.bootcdn.net/ajax/libs/pdf.js/2.16.105/pdf.worker.js";
const pdfUrl = query.url as string;
const pdfPage = ref(1);
const pdfPageCount = ref(0);
const pageCount = 1;

const renderPdf = async () => {
  try {
    const loadingTask = getDocument(pdfUrl);
    loadingTask.promise.then(function (pdf) {
      console.log("PDF loaded");

      pdfPageCount.value = pdf.numPages;

      const pageNumber = pdfPage.value;

      pdf.getPage(pageNumber).then(function (page) {
        console.log("Page loaded");

        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.getElementById(
          "the-canvas",
        ) as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
          console.log("Page rendered");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  renderPdf();
});

watch(pdfPage, () => {
  renderPdf();
});
</script>
