package org.fabric3.management.rest.console;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.fabric3.host.util.IOHelper;

/**
 * @author ievdokimov
 * 
 */
public class ConsoleResourceServlet extends HttpServlet {
	
	private static final long serialVersionUID = 7732820672564562694L;

	private static final String INDEX = "index.html";

	static final String ROOT_PATH = "/management/console/*";
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String pathInfo = req.getPathInfo();		
		if (pathInfo == null) {
			resp.sendRedirect(ROOT_PATH.substring(0, ROOT_PATH.length()-1));
			return;
		}
		pathInfo = pathInfo.equals("/") ? INDEX : pathInfo;
		pathInfo = pathInfo.startsWith("/") ? pathInfo.substring(1) : pathInfo; // strip '/' from resource
		InputStream is = getClass().getClassLoader().getResourceAsStream(pathInfo);
		if (is == null) {
			throw new IOException("No resource : " + pathInfo);
		}
		IOHelper.copy(is, resp.getOutputStream());
		IOHelper.closeQuietly(is);
	};

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doGet(req, resp);
	}

}
