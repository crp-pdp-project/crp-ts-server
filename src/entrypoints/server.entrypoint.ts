import 'dotenv/config';
import https from 'https';

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import cors from '@fastify/cors';
import ejs from 'ejs';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { AccountPasswordV1Docs } from 'src/app/controllers/accountPasswordV1/accountPassword.docs';
import { AccountPasswordV1Router } from 'src/app/controllers/accountPasswordV1/accountPassword.router';
import { AddDeviceBiometricPasswordV1Docs } from 'src/app/controllers/addDeviceBiometricPasswordV1/addDeviceBiometricPassword.docs';
import { AddDeviceBiometricPasswordV1Router } from 'src/app/controllers/addDeviceBiometricPasswordV1/addDeviceBiometricPassword.router';
import { AppointmentTypesListV1Docs } from 'src/app/controllers/appointmentTypesListV1/appointmentTypesList.docs';
import { AppointmentTypesListV1Router } from 'src/app/controllers/appointmentTypesListV1/appointmentTypesList.router';
import { AvailabilityListV1Docs } from 'src/app/controllers/availabilityListV1/availabilityList.docs';
import { AvailabilityListV1Router } from 'src/app/controllers/availabilityListV1/availabilityList.router';
import { CancelAppointmentV1Docs } from 'src/app/controllers/cancelAppointmentV1/cancelAppointment.docs';
import { CancelAppointmentV1Router } from 'src/app/controllers/cancelAppointmentV1/cancelAppointment.router';
import { ConfirmVerificationOTPV1Docs } from 'src/app/controllers/confirmVerificationOtpV1/confirmVerificationOtp.docs';
import { ConfirmVerificationOTPV1Router } from 'src/app/controllers/confirmVerificationOtpV1/confirmVerificationOtp.routes';
import { CreateAppointmentV1Docs } from 'src/app/controllers/createAppointmentV1/createAppointment.docs';
import { CreateAppointmentV1Router } from 'src/app/controllers/createAppointmentV1/createAppointment.router';
import { CreatePatientV1Docs } from 'src/app/controllers/createPatientV1/createPatient.docs';
import { CreatePatientV1Router } from 'src/app/controllers/createPatientV1/createPatient.router';
import { CreateRelativeInformationV1Docs } from 'src/app/controllers/createRelativeInformationV1/createRelativeInformation.docs';
import { CreateRelativeInformationV1Router } from 'src/app/controllers/createRelativeInformationV1/createRelativeInformation.router';
import { CreateRelativeV1Docs } from 'src/app/controllers/createRelativeV1/createRelative.docs';
import { CreateRelativeV1Router } from 'src/app/controllers/createRelativeV1/createRelative.router';
import { DeleteBiometricPasswordV1Docs } from 'src/app/controllers/deleteBiometricPasswordV1/deleteBiometricPassword.docs';
import { DeleteBiometricPasswordV1Router } from 'src/app/controllers/deleteBiometricPasswordV1/deleteBiometricPassword.router';
import { DeletePatientAccountV1Docs } from 'src/app/controllers/deletePatientAccountV1/deletePatientAccount.docs';
import { DeletePatientAccountV1Router } from 'src/app/controllers/deletePatientAccountV1/deletePatientAccount.router';
import { DeleteRelativeV1Docs } from 'src/app/controllers/deleteRelativeV1/deleteRelative.docs';
import { DeleteRelativeV1Router } from 'src/app/controllers/deleteRelativeV1/deleteRelative.router';
import { DoctorsListV1Docs } from 'src/app/controllers/doctorsListV1/doctorsList.docs';
import { DoctorsListV1Router } from 'src/app/controllers/doctorsListV1/doctorsList.router';
import { HealthInsuranceViewV1Docs } from 'src/app/controllers/healthInsuranceViewV1/healthInsuranceView.docs';
import { HealthInsuranceViewV1Router } from 'src/app/controllers/healthInsuranceViewV1/healthInsuranceView.routes';
import { InformInsuranceInterestV1Docs } from 'src/app/controllers/informInsuranceInterestV1/informInsuranceInterest.docs';
import { InformInsuranceInterestV1Router } from 'src/app/controllers/informInsuranceInterestV1/informInsuranceInterest.router';
import { InsurancesListV1Docs } from 'src/app/controllers/insurancesListV1/insurancesList.docs';
import { InsurancesListV1Router } from 'src/app/controllers/insurancesListV1/insurancesList.router';
import { InsuredPatientDuesV1Docs } from 'src/app/controllers/insuredPatientDuesV1/insuredPatientDues.docs';
import { InsuredPatientDuesV1Router } from 'src/app/controllers/insuredPatientDuesV1/insuredPatientDues.router';
import { PatientAppointmentDetailV1Docs } from 'src/app/controllers/patientAppointmentDetailV1/patientAppointmentDetail.docs';
import { PatientAppointmentDetailV1Router } from 'src/app/controllers/patientAppointmentDetailV1/patientAppointmentDetail.router';
import { PatientAppointmentsV1Docs } from 'src/app/controllers/patientAppointmentsV1/patientAppointments.docs';
import { PatientAppointmentsV1Router } from 'src/app/controllers/patientAppointmentsV1/patientAppointments.router';
import { PatientProfileV1Docs } from 'src/app/controllers/patientProfileV1/patientProfile.docs';
import { PatientProfileV1Router } from 'src/app/controllers/patientProfileV1/patientProfile.router';
import { PatientRelativesV1Docs } from 'src/app/controllers/patientRelativesV1/patientRelatives.docs';
import { PatientRelativesV1Router } from 'src/app/controllers/patientRelativesV1/patientRelatives.routes';
import { PatientVerificationV1Docs } from 'src/app/controllers/patientVerificationV1/patientVerification.docs';
import { PatientVerificationV1Router } from 'src/app/controllers/patientVerificationV1/patientVerification.routes';
import { PayHealthInsuranceV1Docs } from 'src/app/controllers/payHealthInsuranceV1/payHealthInsurance.docs';
import { PayHealthInsuranceV1Router } from 'src/app/controllers/payHealthInsuranceV1/relativeVerification.router';
import { POSConfigV1Docs } from 'src/app/controllers/posConfigV1/posConfig.docs';
import { POSConfigV1Router } from 'src/app/controllers/posConfigV1/posConfig.router';
import { RelationshipsListV1Docs } from 'src/app/controllers/relationshipsListV1/relationshipsList.docs';
import { RelationshipsListV1Router } from 'src/app/controllers/relationshipsListV1/relationshipsList.router';
import { RelativeVerificationV1Docs } from 'src/app/controllers/relativeVerificationV1/relativeVerification.docs';
import { RelativeVerificationV1Router } from 'src/app/controllers/relativeVerificationV1/relativeVerification.router';
import { RescheduleAppointmentV1Docs } from 'src/app/controllers/rescheduleAppointmentV1/rescheduleAppointment.docs';
import { RescheduleAppointmentV1Router } from 'src/app/controllers/rescheduleAppointmentV1/rescheduleAppointment.router';
import { SendVerificationOTPV1Docs } from 'src/app/controllers/sendVerificationOtpV1/sendVerificationOtp.docs';
import { SendVerificationOTPV1Router } from 'src/app/controllers/sendVerificationOtpV1/sendVerificationOtp.routes';
import { SignInPatientV1Docs } from 'src/app/controllers/signInPatientV1/signInPatient.docs';
import { SignInPatientV1Router } from 'src/app/controllers/signInPatientV1/signInPatient.routes';
import { SignOutPatientV1Docs } from 'src/app/controllers/signOutPatientV1/signOutPatient.docs';
import { SignOutPatientV1Router } from 'src/app/controllers/signOutPatientV1/signOutPatient.routes';
import { SitedsPriceV1Docs } from 'src/app/controllers/sitedsPriceV1/sitedsPrice.docs';
import { SitedsPriceV1Router } from 'src/app/controllers/sitedsPriceV1/sitedsPrice.router';
import { SpecialtiesListV1Docs } from 'src/app/controllers/specialtiesListV1/specialtiesList.docs';
import { SpecialtiesListV1Router } from 'src/app/controllers/specialtiesListV1/specialtiesList.routes';
import { LoggerClient } from 'src/clients/logger.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { Environments } from 'src/general/enums/environments.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';
import { OpenApiManager } from 'src/general/managers/openapi/openapi.manager';
import swaggerMeta from 'src/general/static/swaggerMeta.static';
import swaggerTemplate from 'src/general/templates/swagger.template';

export class Server {
  private static readonly app: FastifyInstance = Fastify({ logger: false });
  private static readonly registry: OpenAPIRegistry = new OpenAPIRegistry();
  private static readonly manager: OpenApiManager = new OpenApiManager(this.registry);
  private static readonly logger: LoggerClient = LoggerClient.instance;
  private static readonly port: number = Number(EnvHelper.get('NODE_PORT'));

  static async start(): Promise<void> {
    try {
      await this.setup();
      await this.app.listen({ host: '0.0.0.0', port: this.port });
      this.logger.info(`Server running on port ${this.port}`);
    } catch (error) {
      this.logger.error('Server failed on startup', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  static async shutdown(fatal = false): Promise<void> {
    try {
      await this.app.close();
      this.logger.info('Server closed gracefully');
      process.exit(fatal ? 1 : 0);
    } catch (error) {
      this.logger.error('Error during shutdown', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  private static async setup(): Promise<void> {
    this.registerHooks();
    this.registerDocs();
    this.registerRoutes();
    await this.app.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    if (EnvHelper.getCurrentEnv() !== Environments.PRD) {
      this.setupDocsEndpoint();
      this.setupHttpClient();
    }
  }

  private static registerHooks(): void {
    this.app.addHook('onRequest', async (request: FastifyRequest) => {
      this.logger.info('Incoming Request', {
        method: request.method,
        url: request.url,
        ip: request.ip,
        body: request.body ?? {},
        query: request.query ?? {},
        path: request.params ?? {},
        userAgent: request.headers['user-agent'],
      });
    });

    this.app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
      this.logger.info('Response Sent', {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
      });
    });
  }

  private static registerDocs(): void {
    new AccountPasswordV1Docs(this.manager).registerDocs();
    new AddDeviceBiometricPasswordV1Docs(this.manager).registerDocs();
    new AppointmentTypesListV1Docs(this.manager).registerDocs();
    new AvailabilityListV1Docs(this.manager).registerDocs();
    new ConfirmVerificationOTPV1Docs(this.manager).registerDocs();
    new CreateAppointmentV1Docs(this.manager).registerDocs();
    new DeleteBiometricPasswordV1Docs(this.manager).registerDocs();
    new DeletePatientAccountV1Docs(this.manager).registerDocs();
    new DoctorsListV1Docs(this.manager).registerDocs();
    new InsurancesListV1Docs(this.manager).registerDocs();
    new PatientAppointmentsV1Docs(this.manager).registerDocs();
    new PatientProfileV1Docs(this.manager).registerDocs();
    new PatientRelativesV1Docs(this.manager).registerDocs();
    new PatientVerificationV1Docs(this.manager).registerDocs();
    new SendVerificationOTPV1Docs(this.manager).registerDocs();
    new SignInPatientV1Docs(this.manager).registerDocs();
    new SignOutPatientV1Docs(this.manager).registerDocs();
    new SpecialtiesListV1Docs(this.manager).registerDocs();
    new PatientAppointmentDetailV1Docs(this.manager).registerDocs();
    new CancelAppointmentV1Docs(this.manager).registerDocs();
    new RescheduleAppointmentV1Docs(this.manager).registerDocs();
    new CreatePatientV1Docs(this.manager).registerDocs();
    new InsuredPatientDuesV1Docs(this.manager).registerDocs();
    new HealthInsuranceViewV1Docs(this.manager).registerDocs();
    new POSConfigV1Docs(this.manager).registerDocs();
    new RelationshipsListV1Docs(this.manager).registerDocs();
    new RelativeVerificationV1Docs(this.manager).registerDocs();
    new CreateRelativeInformationV1Docs(this.manager).registerDocs();
    new CreateRelativeV1Docs(this.manager).registerDocs();
    new DeleteRelativeV1Docs(this.manager).registerDocs();
    new InformInsuranceInterestV1Docs(this.manager).registerDocs();
    new SitedsPriceV1Docs(this.manager).registerDocs();
    new PayHealthInsuranceV1Docs(this.manager).registerDocs();
  }

  private static registerRoutes(): void {
    new AccountPasswordV1Router(this.app).registerRouter();
    new AddDeviceBiometricPasswordV1Router(this.app).registerRouter();
    new AppointmentTypesListV1Router(this.app).registerRouter();
    new AvailabilityListV1Router(this.app).registerRouter();
    new ConfirmVerificationOTPV1Router(this.app).registerRouter();
    new CreateAppointmentV1Router(this.app).registerRouter();
    new DeleteBiometricPasswordV1Router(this.app).registerRouter();
    new DeletePatientAccountV1Router(this.app).registerRouter();
    new DoctorsListV1Router(this.app).registerRouter();
    new InsurancesListV1Router(this.app).registerRouter();
    new PatientAppointmentsV1Router(this.app).registerRouter();
    new PatientProfileV1Router(this.app).registerRouter();
    new PatientRelativesV1Router(this.app).registerRouter();
    new PatientVerificationV1Router(this.app).registerRouter();
    new SendVerificationOTPV1Router(this.app).registerRouter();
    new SignInPatientV1Router(this.app).registerRouter();
    new SignOutPatientV1Router(this.app).registerRouter();
    new SpecialtiesListV1Router(this.app).registerRouter();
    new PatientAppointmentDetailV1Router(this.app).registerRouter();
    new CancelAppointmentV1Router(this.app).registerRouter();
    new RescheduleAppointmentV1Router(this.app).registerRouter();
    new CreatePatientV1Router(this.app).registerRouter();
    new InsuredPatientDuesV1Router(this.app).registerRouter();
    new HealthInsuranceViewV1Router(this.app).registerRouter();
    new POSConfigV1Router(this.app).registerRouter();
    new RelationshipsListV1Router(this.app).registerRouter();
    new RelativeVerificationV1Router(this.app).registerRouter();
    new CreateRelativeInformationV1Router(this.app).registerRouter();
    new CreateRelativeV1Router(this.app).registerRouter();
    new DeleteRelativeV1Router(this.app).registerRouter();
    new InformInsuranceInterestV1Router(this.app).registerRouter();
    new SitedsPriceV1Router(this.app).registerRouter();
    new PayHealthInsuranceV1Router(this.app).registerRouter();
  }

  private static setupDocsEndpoint(): void {
    const generator = new OpenApiGeneratorV3(this.registry.definitions);

    this.app.get('/docs', async (_, reply) => {
      const html = ejs.render(swaggerTemplate, {
        title: `${swaggerMeta.info.title} - Docs`,
      });

      reply.type('text/html').send(html);
    });

    this.app.get('/docs/spec.json', async (_, reply) => {
      const spec = generator.generateDocument(swaggerMeta);

      reply.type('application/json').send(spec);
    });
  }

  private static setupHttpClient(): void {
    https.globalAgent.options = {
      ...https.globalAgent.options,
      rejectUnauthorized: false,
      keepAlive: true,
      timeout: CRPConstants.SOAP_TIMEOUT,
      checkServerIdentity: () => undefined,
    };
  }
}

void Server.start();

process.once('SIGINT', () => Server.shutdown());
process.once('SIGTERM', () => Server.shutdown());

process.on('unhandledRejection', (err) => {
  LoggerClient.instance.error('Unhandled promise rejection', {
    err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : String(err),
  });
});

process.on('uncaughtException', (err) => {
  LoggerClient.instance.error('Uncaught exception', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  setImmediate(() => Server.shutdown(true));
});
