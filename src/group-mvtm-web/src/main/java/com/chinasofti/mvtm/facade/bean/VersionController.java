package com.chinasofti.mvtm.facade.bean;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;

import com.chinasofti.vtmsln.model.BaseResponse;

@RestController
@RequestMapping(path = "/info")
public class VersionController {

	private Logger logger = LoggerFactory.getLogger(getClass());
	
	private static final String JSERRSION = "jsVersion";

	@Autowired
	private WebApplicationContext webAppContext;

	@RequestMapping(path = "/getVersion", method = RequestMethod.POST)
	public BaseResponse getVersion() {
		logger.info("mVTM version is " + webAppContext.getBean("webAppVersion").toString());
		String version = webAppContext.getBean("webAppVersion").toString(); 
		BaseResponse baseResponse = new BaseResponse();
		Map<String, String> map = new HashMap<>();
		map.put(JSERRSION, version);
		baseResponse.getData().add(map);
		return baseResponse;
	}
}
