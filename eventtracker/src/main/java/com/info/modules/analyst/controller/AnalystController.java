package com.info.modules.analyst.controller;

import com.info.modules.analyst.service.AnalystService;
import com.info.modules.analyst.vo.*;
import com.info.modules.exceptions.GlobalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.List;

@RestController
@RequestMapping("mvc")
public class AnalystController {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AnalystService analystService;

    @RequestMapping(path = "/analystReport", method = RequestMethod.GET)
    public
    @ResponseBody
    List<AnalystReportVO> getAnalystReport(@RequestParam("userId") Long userId, @RequestParam("eventId") Long eventId) throws GlobalException {
        return analystService.getAnalystReport(userId, eventId);
    }

    @RequestMapping(value = "/getDownloads", method = RequestMethod.GET)
    public @ResponseBody
    List<ExportsConfigVO> getDownloads(@RequestParam("userId") Long userId, @RequestParam("roleId") Long roleId) throws GlobalException {

        List<ExportsConfigVO> configs = analystService.getDownloads(userId, roleId);

        return configs;
    }

    @RequestMapping(value = "/generateExport", method = RequestMethod.GET)
    public @ResponseBody
    int generateExport(@RequestParam("userId") Long userId, @RequestParam("exportId") Long exportId, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        try {
            return analystService.generateExport(exportId, userId,startDate,endDate);

        } catch (Exception e) {
            log.error("An error occurred while generating Export.", e);
        }
        return -1;
    }


    @RequestMapping(value = "/downloadFile", method = RequestMethod.GET)
    public void downloadFile(HttpServletRequest request, HttpServletResponse response,
                             @RequestParam("fileId") int fileId) {
        try {
            // 1. Get File from db
            ExportVO eho = analystService.downloadFile(fileId);

            // 2. Send file to UI
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", String.format("inline; filename=\"" + eho.getFileName() + "\""));

            if (eho.getFileData() != null) {
                OutputStream os = response.getOutputStream();
                os.write(eho.getFileData());
                os.flush();
            }
        } catch (Exception e) {
            log.error("An error occurred while downloading export file.", e);
        }
    }
}
