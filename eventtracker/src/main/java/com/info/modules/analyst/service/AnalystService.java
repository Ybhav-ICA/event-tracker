package com.info.modules.analyst.service;

import com.info.modules.analyst.dao.AnalystDAO;
import com.info.modules.analyst.vo.*;
import com.info.modules.exceptions.GlobalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class AnalystService {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AnalystDAO analystDAO;

    public List<AnalystReportVO> getAnalystReport(Long userId, Long eventId) throws GlobalException {
        return analystDAO.getAnalystReport(userId, eventId);
    }

    public List<ExportsConfigVO> getDownloads(Long userId, Long roleId) throws GlobalException {
        return analystDAO.getDownloads(userId, roleId);
    }

    public int generateExport(Long exportId, Long userId,String startDate,String endDate) throws GlobalException {
        return analystDAO.generateExport(exportId, userId,startDate,endDate);
    }

    public ExportVO downloadFile(int fileId) throws GlobalException {
        return analystDAO.downloadFile(fileId);
    }
}
