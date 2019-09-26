package com.info.modules.analyst.dao;

import com.info.modules.analyst.rowMappers.AnalystReportRMVO;
import com.info.modules.analyst.rowMappers.ExportRMVO;
import com.info.modules.analyst.vo.AnalystReportVO;
import com.info.modules.analyst.vo.ExportVO;
import com.info.modules.analyst.vo.ExportsConfigVO;
import com.info.modules.exceptions.GlobalException;
import com.info.utils.SPUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AnalystDAO {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private DataSource dataSource;

    public List<AnalystReportVO> getAnalystReport(Long userId, Long eventId) throws GlobalException {
        List<AnalystReportVO> response = null;
        Long startTime = System.currentTimeMillis();
        try {

            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserID", userId)
                    .addValue("EventID", eventId);

            response = SPUtils.execute(dataSource, null, SPUtils.GET_ANALYST_REPORT, inputParams,
                    outputParams, null, new AnalystReportRMVO());

            log.debug("Time taken to execute " + SPUtils.GET_ANALYST_REPORT + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");
        } catch (Exception e) {
            log.error("An error occurred while fetching forms.", e);
            throw new GlobalException("An error occurred while fetching forms. Please contact Support Team.");
        }
        return response;
    }

    public List<ExportsConfigVO> getDownloads(Long userId, Long roleId) throws GlobalException {
        List<ExportsConfigVO> exportConfigs = new ArrayList<>();

        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserId", userId)
                    .addValue("RoleId", roleId);

            exportConfigs = SPUtils.execute(dataSource, null, SPUtils.CS_SP_ExportConfigGet, inputParams, outputParams
                    , null, (rs, i) -> {
                        ExportsConfigVO vo = new ExportsConfigVO();
                        vo.setExportName(rs.getString("ExportName"));
                        vo.setId(rs.getLong("ID"));
                        return vo;
                    });

        } catch (Exception e) {
            log.error("An error occurred while fetching Export Configs. Please contact the Support Team", e);
            throw new GlobalException("An error occurred while fetching Export Configs. Please contact the Support Team");
        }

        return exportConfigs;
    }

    public int generateExport(Long exportId, Long userId,String startDate,String endDate) throws GlobalException {
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserId", userId)
                    .addValue("StartDate", startDate)
                    .addValue("EndDate", endDate)
                    .addValue("ExportConfigID", exportId);

            Map<String, Object> out = SPUtils.execute(dataSource, null, SPUtils.CS_Export_SPWrapper,
                    inputParams, outputParams);

            List<Map<String, Object>> rs = (List<Map<String, Object>>) out.get("#result-set-1");
            int fileId = (Integer) rs.get(0).get("exportid");

            return fileId;
        } catch (Exception e) {
            log.error("An error occurred while generating the export wrapper", e);
            throw new GlobalException("An error occurred while generating the export wrapper.");
        }
    }

    public ExportVO downloadFile(int fileId) throws GlobalException {
        try {
            List<ExportVO> vo = new ArrayList<ExportVO>();
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("ExportId", fileId);
            vo = SPUtils.execute(dataSource, null, SPUtils.CS_Download_File,
                    inputParams, outputParams, null, new ExportRMVO());
            if (vo.size() > 0) {
                return vo.get(0);
            } else {
                return new ExportVO();
            }
        } catch (Exception e) {
            log.error("An error occurred while generating the export wrapper.", e);
            throw new GlobalException("An error occurred while generating the export wrapper");
        }
    }
}
